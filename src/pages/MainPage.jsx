import React, { useState, useEffect } from "react";
import "./MainPage.css";
import { useNavigate, useLocation } from "react-router-dom";

const MainPage = ({ songs, albums, playlists, artists }) => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const url = "http://localhost:5000/api/genres";
  const getData = async () => {
    try {
      const res = await fetch(url);
      if (res.ok) {
        let json = await res.json();
        setGenres(json);
      } else {
        console.log("Ошибка" + res.status);
      }
    } catch (error) {
      console.error("Ошибка ", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const GenreCard = ({ genreItem }) => {
    return (
      <div
        className="main-genre-card"
        onClick={() =>
          navigate(`/songs-genres/${genreItem.GenreID}`, {
            state: { genreItem },
          })
        }
      >
        <img
          className="image-genre"
          src={genreItem?.PhotoCover}
          alt={genreItem?.Title}
        />
        <h4 style={{ marginTop: "10px" }}>{genreItem.Title}</h4>
      </div>
    );
  };

  const navigateToAlbum = (album) => {
    navigate(`/album/${album.AlbumID}`, { state: { album } });
  };

  const navigateToSinger = (artist) => {
    navigate(`/singer/${artist.ArtistID}`, { state: { artist } });
  };

  const navigateToPlaylist = (playlist) => {
    navigate(`/playlist/${playlist.PlaylistID}`, { state: { playlist } });
  };

  return (
    <div className="main-page">
      <div className="playlist-of-the-day">
        <h1 style={{ fontSize: "50px" }}>
          Плейлисты <br /> Дня
        </h1>
        <div className="image-playlists">
          {playlists.slice(0, 2).map((playlist) => (
            <img
              key={playlist.PlaylistID}
              src={playlist.PhotoCover}
              onClick={() => navigateToPlaylist(playlist)}
              alt={playlist.Title}
            />
          ))}
        </div>
      </div>

      <div className="top">
        <div className="main-albums">
          <h2>
            <b>Альбомы Сибири*</b>
          </h2>
          <div className="image-albums">
            {albums.slice(0, 4).map((album) => (
              <img
                key={album.AlbumID}
                src={album.PhotoCover}
                onClick={() => navigateToAlbum(album)}
                alt={album.Title}
              />
            ))}
          </div>
        </div>

        <div className="best-singers">
          <h1>Исполнители</h1>
          <div className="image-singers">
            {artists.slice(0, 5).map((artist, index) => (
              <div key={artist.ArtistID}>
                <img
                  className={`image${index + 1}`}
                  src={artist.PhotoProfile}
                  onClick={() => navigateToSinger(artist)}
                  alt={artist.Nickname}
                />
                <p className="artist-nickname">{artist.Nickname}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="genres">
        <h1 style={{ margin: "0px 0px 15px 20px " }}>Жанры</h1>
        <div className="collection">
          {genres.map((item, index) => (
            <GenreCard key={index} genreItem={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
