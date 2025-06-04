import React, { useState, useEffect } from "react";
import "./MainPage.css";
import playlistDay from "../assets/party.webp";
import playlistDay2 from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import singerBack from "../assets/bibi_back.jpg";

const MainPage = () => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const GenreCard = ({ genreItem }) => {
    return (
      <div
        className="main-genre-card"
        onClick={() => navigate("/songs-genres", { state: { genreItem } })}
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

  const playlists = [
    { id: 1, title: "34647", cover: playlistDay, url: "wuiryew78r" },
    { id: 2, title: "uhfd", cover: playlistDay2, url: "f.knhdusf7" },
  ];

  const albums = [
    { id: 1, title: "Album 1", cover: playlistDay, url: "98gfdg" },
    { id: 2, title: "Album 2", cover: playlistDay, url: "ok4r" },
    { id: 3, title: "Album 3", cover: playlistDay, url: "vgfd" },
    { id: 4, title: "Album 4", cover: playlistDay2, url: "543" },
  ];

  const singers = [
    {
      id: 1,
      nickname: "Singer 1",
      photo: playlistDay,
      biography:
        "jgk gfbyi ftyif gkgnkgyuk gy ukgyukgyugyu gi kyug yukgyugk jgk gfbyi ftyif gkgnkgyuk gy ukgyukgyugyu gi kyug yukgyugk jgk gfbyi ftyif gkgnkgyuk gy ukgyukgyugyu gi kyug yukgyugk ",
      backgroundPhoto: singerBack,
    },
    { id: 2, nickname: "Singer 2", photo: playlistDay2 },
    { id: 3, nickname: "Singer 3", photo: playlistDay },
    { id: 4, nickname: "Singer 4", photo: playlistDay2 },
    { id: 5, nickname: "Singer 5", photo: playlistDay },
    { id: 6, nickname: "Singer 6", photo: playlistDay2 },
  ];

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
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const navigateToAlbum = (album) => {
    navigate("/album", { state: { album } });
  };

  const navigateToSinger = (singer) => {
    navigate("/singer", { state: { singer } });
  };

  const navigateToPlaylist = (playlist) => {
    navigate("/playlist", { state: { playlist } });
  };

  return (
    <div className="main-page">
      <div className="playlist-of-the-day">
        <h1 style={{ fontSize: "50px" }}>
          Плейлисты <br /> Дня
        </h1>
        <div className="image-playlists">
          {playlists.map((playlist) => (
            <img
              key={playlist.id}
              src={playlist.cover}
              onClick={() => navigateToPlaylist(playlist)}
              alt={playlist.title}
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
                src={singer.photo}
                onClick={() => navigateToSinger(singer)}
                alt={singer.nickname}
              />
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
