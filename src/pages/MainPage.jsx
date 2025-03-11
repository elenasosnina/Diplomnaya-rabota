import React from "react";
import "./MainPage.css";
import Genre from "../components/Genres";
import playlistDay from "../assets/party.webp";
import playlistDay2 from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
  const navigate = useNavigate();
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
          />
          <img
            src={playlistDay2}
            onClick={() => handleNavigation("/playlist")}
          />
        </div>
      </div>
      <div className="top">
        <div className="main-albums">
          <h2>
            <b>Альбомы Сибири*</b>
          </h2>
          <div className="image-albums">
            <img src={playlistDay} />
            <img src={playlistDay2} />
            <img src={playlistDay} />
            <img src={playlistDay2} />
          </div>
        </div>
        <div className="best-singers">
          <h1>Исполнители</h1>
          <div className="image-singers">
            <img className="image1" src={playlistDay} />
            <img className="image2" src={playlistDay2} />
            <img className="image3" src={playlistDay} />
            <img className="image4" src={playlistDay2} />
            <img className="image5" src={playlistDay} />
            <img className="image6" src={playlistDay2} />
          </div>
        </div>
      </div>
      <div className="genres">
        <h1 style={{ margin: "0px 0px 15px 20px " }}>Жанры</h1>
        <div className="collection">
          <Genre></Genre>
          <Genre></Genre>
          <Genre></Genre>
          <Genre></Genre>
        </div>
      </div>
    </div>
  );
};
export default MainPage;
