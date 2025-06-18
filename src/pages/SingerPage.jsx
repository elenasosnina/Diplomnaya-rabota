import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SingerPage.css";
import Bheart from "../assets/Bheart.png";
import Wheart from "../assets/Wheart.png";
import Songs from "../components/Songs";
import Media from "../components/Media";
import { useNavigate, useLocation } from "react-router-dom";

const SingerPage = ({
  isPlaying,
  currentSong,
  currentTime,
  toggleSongPlay,
  onLikeChange,
  onSongSelect,
  songs,
  setSongs,
}) => {
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const item = location.state?.artist;
    if (item) {
      setArtist(item);
    }
  }, [location.state]);

  const LikeChange = async () => {
    if (!user || !artist) return;

    try {
      const newLikedStatus = !artist.liked;
      setArtist((prev) => ({ ...prev, liked: newLikedStatus }));
      const response = await fetch(
        `http://localhost:5000/api/artist/likeChange/${artist.ArtistID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserID: user.UserID }),
        }
      );

      if (!response.ok) {
        setArtist((prev) => ({ ...prev, liked: !newLikedStatus }));
        throw new Error(`Ошибка: ${response.status}`);
      }

      const result = await response.json();

      setArtist((prev) => ({ ...prev, liked: result.liked }));
    } catch (error) {
      console.error("Ошибка при изменении статуса артиста:", error);
    }
  };
  const toggleArtistLike = (e) => {
    e.preventDefault();
    LikeChange();
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!artist || !artist.ArtistID) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const songsUrl = `http://localhost:5000/api/artists/songs/${artist.ArtistID}`;
        const songsResponse = await fetch(songsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserID: user.UserID }),
        });

        if (!songsResponse.ok) {
          console.error(`Ошибка: ${songsResponse.status}`);
        } else {
          const songsData = await songsResponse.json();
          setSongs(songsData);
        }

        const albumsUrl = `http://localhost:5000/api/artists/albums/${artist.ArtistID}`;
        const albumsResponse = await fetch(albumsUrl);

        if (!albumsResponse.ok) {
          console.error(`Ошибка: ${albumsResponse.status}`);
        } else {
          const albumsData = await albumsResponse.json();
          setAlbums(albumsData);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artist, setSongs, user?.UserID]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const LoadingIndicator = () => (
    <div className="search-process">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (loading || !artist) {
    return <LoadingIndicator />;
  }
  return (
    <div className="singerPage">
      <div className="cover-singerPage">
        <img
          className="background-singerPage"
          src={artist.PhotoBackground}
          alt="Singer Background"
        />
        <div className="photoes-artist">
          <img
            className="photoes-artist-img"
            src={artist.PhotoProfile}
            alt="Singer Cover"
          />
          <div
            className="btn-add"
            onClick={(e) => toggleArtistLike(e)}
            style={{
              backgroundColor: artist.liked ? "#4f0fff" : "white",
            }}
          >
            {artist.liked ? (
              <img src={Wheart} alt="White Heart" />
            ) : (
              <img src={Bheart} alt="Black Heart" />
            )}
          </div>
          <h1
            style={{
              marginLeft: "30px",
              marginBottom: "0px",
              fontSize: "50px",
              fontWeight: "bolder",
            }}
          >
            {artist.Nickname}
          </h1>
        </div>
      </div>
      <div className="songs-singerPage">
        <div className="songCol">
          {songs.slice(0, 6).map((song) => (
            <Songs
              key={song.SongID}
              song={song}
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              onLikeChange={onLikeChange}
              toggleSongPlay={toggleSongPlay}
              onSongSelect={onSongSelect}
            />
          ))}
        </div>
        <button
          className="btn-more"
          onClick={() => handleNavigation("/songsList")}
        >
          Больше
        </button>
      </div>
      <div className="albums-singerPage">
        <p> Альбомы </p>
        <div className="collection-albums">
          <div className="albums-covers">
            {albums.slice(0, 6).map((album) => (
              <Media
                key={album.AlbumID}
                item={album}
                type="album"
                onClick={() =>
                  navigate(`/album/${album.AlbumID}`, {
                    state: { album },
                  })
                }
              />
            ))}
          </div>
          <button
            className="album-more"
            onClick={() =>
              navigate(`/albumList`, {
                state: { albums },
              })
            }
          >
            Больше
          </button>
        </div>
      </div>
      <div className="info-singerPage">
        <div className="info-about-singer">
          <h2> Об исполнителе </h2> <p> {artist.Biography} </p>
        </div>
        <img
          src={artist.BiographyPhoto}
          style={{
            width: "350px",
            height: "200px",
            margin: "40px 80px",
            borderRadius: "50px",
          }}
          alt="Cover Song"
        />
      </div>
    </div>
  );
};

export default SingerPage;
