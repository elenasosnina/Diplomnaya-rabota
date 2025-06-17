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
  onSongSelect,
  songs,
  setSongs,
}) => {
  const [isClicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const heartRef = useRef(null);
  const location = useLocation();
  const artist = location.state?.artist;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const likedArtist = () => {
    setClicked(!isClicked);
  };

  const likeClick = () => {
    setIsLiked(!isLiked);
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
        }

        const songsData = await songsResponse.json();
        setSongs(songsData);

        const albumsUrl = `http://localhost:5000/api/artists/albums/${artist.ArtistID}`;
        const albumsResponse = await fetch(albumsUrl);

        if (!albumsResponse.ok) {
          console.error(`Ошибка: ${albumsResponse.status}`);
        }

        const albumsData = await albumsResponse.json();
        setAlbums(albumsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artist, setSongs]);

  const handleSongChange = useCallback(
    (newSong) => {
      if (currentSong && currentSong.SongID === newSong.SongID) {
        toggleSongPlay();
      } else {
        onSongSelect(newSong);
      }
    },
    [currentSong, toggleSongPlay, onSongSelect]
  );

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

  if (loading) {
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
          <img src={artist.PhotoProfile} alt="Singer Cover" />
          <div
            className="btn-add"
            onClick={likedArtist}
            style={{
              backgroundColor: isClicked ? "#4f0fff" : "white",
            }}
          >
            {isClicked ? (
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
                    state: {
                      album: album,
                    },
                  })
                }
              />
            ))}
          </div>
          <button
            className="album-more"
            onClick={() =>
              navigate(`/albumList`, {
                state: {
                  albums: albums,
                },
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
