import React from "react";
import "./MainPage.css";
import Genre from "../components/Genres";
import playlistDay from "../assets/party.webp";
import playlistDay2 from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const albums = [
    { id: 1, title: "Album 1", cover: playlistDay },
    { id: 2, title: "Album 2", cover: playlistDay2 },
    { id: 3, title: "Album 3", cover: playlistDay },
    { id: 4, title: "Album 4", cover: playlistDay2 },
  ];
  const navigateToAlbum = (album) => {
    navigate("/album", { state: { album } });
  };
  const singers = [
    { id: 1, title: "Singer 1", cover: playlistDay },
    { id: 2, title: "Singer 2", cover: playlistDay2 },
    { id: 3, title: "Singer 3", cover: playlistDay },
    { id: 4, title: "Singer 4", cover: playlistDay2 },
    { id: 5, title: "Singer 5", cover: playlistDay },
    { id: 6, title: "Singer 6", cover: playlistDay2 },
  ];

  const navigateToSinger = (singer) => {
    navigate("/singer", { state: { singer } });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="main-page">
      <div className="playlist-of-the-day">
        <h1 style={{ fontSize: "50px" }}>
          Плейлисты
          <br />
          Дня
        </h1>
        <div className="image-playlists">
          <img
            src={playlistDay}
            onClick={() => handleNavigation("/playlist")}
            alt="Playlist 1"
          />
          <img
            src={playlistDay2}
            onClick={() => handleNavigation("/playlist")}
            alt="Playlist 2"
          />
        </div>
      </div>
      <div className="top">
        <div className="main-albums">
          <h2>
            <b>Альбомы Сибири*</b>
          </h2>
          <div className="image-albums">
            {albums.map((album) => (
              <img
                key={album.id}
                src={album.cover}
                onClick={() => navigateToAlbum(album)}
                alt={album.title}
              />
            ))}
          </div>
        </div>
        <div className="best-singers">
          <h1>Исполнители</h1>
          <div className="image-singers">
            {singers.map((singer, index) => (
              <img
                key={singer.id}
                className={`image${index + 1}`}
                src={singer.cover}
                onClick={() => navigateToSinger(singer)}
                alt={singer.title}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="genres">
        <h1 style={{ margin: "0px 0px 15px 20px " }}>Жанры</h1>
        <div className="collection">
          <Genre />
          <Genre />
          <Genre />
          <Genre />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
