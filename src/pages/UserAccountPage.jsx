import React, { useState, useEffect } from "react";
import "./UserAccountPage.css";
import userCover from "../assets/bibi.jpg";
import userBack from "../assets/bibi_back.jpg";
import Artist from "../components/Media";
import { useNavigate } from "react-router-dom";
import Songs from "../components/Songs";
import coverSong from "../assets/party.webp";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import Album from "../components/Album";
import Plus from "../assets/add-playlist.png";

const UserAccountPage = ({
  isPlaying,
  currentSong,
  currentTime,
  duration,
  toggleSongPlay,
  onLikeChange,
  setSongs,
  songs,
  onSongSelect,
}) => {
  const [users, setUser] = useState([
    {
      id: 1,
      nickname: "Holly",
      photo: userCover,
      backgroundPhoto: userBack,
      login: "naruto",
      password: "123456",
      email: "hoLy0_0@gmail.com",
      dayofbirth: "10.02.2000",
      dayofregistration: "09.01.2025",
    },
  ]);
  const user = users[0];
  const [playlists, setPlaylists] = useState([
    {
      id: 121,
      title: "All Around The World",
      cover: coverSong,
    },
  ]);
  const [initialSongs, setInitialSongs] = useState([
    {
      id: 11,
      title: "All Around The World",
      artist: "Justin Bieber",
      audio: audioCover,
      cover: coverSong,
      liked: true,
      lyrics: "cklfadsfdfdsfdfdgf",
      producer: "ufgsdufk",
      authorLyrics: "41324",
      composer: "ewreq",
      rights: "142343",
      duration: "01:02",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
  ]);
  const [albums, setAlbums] = useState([
    {
      id: 1,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 2,
      title: "hoho",
      artist: "GH",
      cover: coverSong,
      producer: "в21312аы",
      authorLyrics: "ав#а",
      composer: "ф2eq",
      rights: "ла3вы",
      duration: "5 ч 12 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 3,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 4,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 5,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 6,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 7,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 8,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
  ]);
  useEffect(() => {
    setSongs(initialSongs);
  }, [setSongs, initialSongs]);
  const [artists, setArtists] = useState([
    {
      id: 10,
      nickname: "kddsfdsfsfsfsdfdfdsfsfljk",
      photo: userCover,
    },
    {
      id: 2,
      nickname: "55sads",
      photo: userCover,
    },
  ]);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ИЗБРАННОЕ"); // 'ИЗБРАННОЕ' or 'СОЗДАННОЕ' or 'СТАТИСТИКА'
  const [activeCategory, setActiveCategory] = useState("Исполнители");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };
  const getCategoryStyle = (category) => {
    return {
      border: "1px solid black",
      borderRadius: "30px",
      padding: "5px 20px",
      fontSize: "20px",
      backgroundColor: activeCategory === category ? "grey" : "transparent",
      cursor: "pointer",
    };
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabStyle = (tab) => {
    return {
      cursor: "pointer",
      fontWeight: activeTab === tab ? "bold" : "normal",
      padding: "10px",
      borderBottom: activeTab === tab ? "2px solid black" : "none",
    };
  };

  const renderCreatedContent = () => {
    return (
      <div className="favourites-playlists">
        {playlists.map((playlist) => (
          <Artist
            key={playlist.id}
            item={playlist}
            type="album"
            onClick={() =>
              navigate("/playlist", {
                state: {
                  playlist: playlist,
                },
              })
            }
          />
        ))}
        <img className="add-playlist" src={Plus} />
      </div>
    );
  };

  const renderStatisticsContent = () => {
    return (
      <div className="component-statistics">
        <h3 className="statistics-title">ВЫ ПРОСЛУШАЛИ</h3>
        <div className="listened">
          <div className="listened-days">
            <p className="listened-value">154</p>
            <p className="listened-label">дней</p>
          </div>
          <div className="listened-hour">
            <p className="listened-value">20 457</p>
            <p className="listened-label">часов</p>
          </div>
        </div>
        <div className="fav">
          <div className="fav-item">
            <h3 className="fav-item-title">ЛЮБИМАЯ ПЕСНЯ</h3>
            <img
              className="fav-item-cover"
              src={songs[0].cover}
              alt="Song Cover"
            />
            <p className="fav-item-name">{songs[0].title}</p>
          </div>
          <div className="fav-item">
            <h3 className="fav-item-title">ЛЮБИМЫЙ ИСПОЛНИТЕЛЬ</h3>
            <img
              className="fav-item-cover"
              src={artists[0].photo}
              alt="Artist Photo"
            />
            <p className="fav-item-name">{artists[0].nickname}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="userPage">
      <div className="cover-userPage">
        <img
          className="background-userPage"
          src={user.backgroundPhoto}
          alt="Background"
        />
        <div className="photoes-user">
          <img src={user.photo} alt="user cover" />
          <h1
            style={{
              marginLeft: "30px",
              marginBottom: "0px",
              fontSize: "50px",
              fontWeight: "bolder",
            }}
          >
            {user.nickname}
          </h1>
        </div>
      </div>
      <div className="inner-menu">
        <h1
          style={getTabStyle("ИЗБРАННОЕ")}
          onClick={() => handleTabClick("ИЗБРАННОЕ")}
        >
          ИЗБРАННОЕ
        </h1>
        <h1
          style={getTabStyle("СОЗДАННОЕ")}
          onClick={() => handleTabClick("СОЗДАННОЕ")}
        >
          СОЗДАННОЕ
        </h1>
        <h1
          style={getTabStyle("СТАТИСТИКА")}
          onClick={() => handleTabClick("СТАТИСТИКА")}
        >
          СТАТИСТИКА
        </h1>
      </div>

      {activeTab === "ИЗБРАННОЕ" && (
        <div className="component-elected">
          <div className="menu-elected-component">
            <div
              style={getCategoryStyle("Исполнители")}
              onClick={() => handleCategoryClick("Исполнители")}
            >
              Исполнители
            </div>
            <div
              style={getCategoryStyle("Треки")}
              onClick={() => handleCategoryClick("Треки")}
            >
              Треки
            </div>
            <div
              style={getCategoryStyle("Плейлисты")}
              onClick={() => handleCategoryClick("Плейлисты")}
            >
              Плейлисты
            </div>
            <div
              style={getCategoryStyle("Альбомы")}
              onClick={() => handleCategoryClick("Альбомы")}
            >
              Альбомы
            </div>
          </div>
          <div
            className="array-favourites"
            style={{
              backgroundColor:
                activeCategory === "Альбомы"
                  ? "transparent"
                  : "rgb(233, 233, 233)",
            }}
          >
            {activeCategory === "Исполнители" && (
              <div className="favourites-artists">
                {artists.map((artist) => (
                  <Artist
                    key={artist.id}
                    item={artist}
                    type="artist"
                    onClick={() =>
                      navigate("/singer", {
                        state: {
                          singer: artist,
                        },
                      })
                    }
                  />
                ))}
              </div>
            )}

            {activeCategory === "Треки" && (
              <div className="songs-list-fav">
                {songs.map((song) => (
                  <Songs
                    key={song.id}
                    song={song}
                    isPlaying={isPlaying}
                    currentSong={currentSong}
                    currentTime={currentTime}
                    toggleSongPlay={toggleSongPlay}
                    onLikeChange={onLikeChange}
                    onSongSelect={onSongSelect}
                  />
                ))}
              </div>
            )}
            {activeCategory === "Плейлисты" && (
              <div className="favourites-playlists">
                {playlists.map((playlist) => (
                  <Artist
                    key={playlist.id}
                    item={playlist}
                    type="album"
                    onClick={() =>
                      navigate("/playlist", {
                        state: {
                          playlist: playlist,
                        },
                      })
                    }
                  />
                ))}
              </div>
            )}
            {activeCategory === "Альбомы" && (
              <div className="favourites-albums">
                {albums.map((album) => (
                  <Album key={album.id} album={album} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "СОЗДАННОЕ" && (
        <div
          className="array-favourites"
          style={{ backgroundColor: "rgb(233, 233, 233)" }}
        >
          {renderCreatedContent()}
        </div>
      )}

      {activeTab === "СТАТИСТИКА" && (
        <div
          className="array-favourites"
          style={{ backgroundColor: "rgb(233, 233, 233)" }}
        >
          {renderStatisticsContent()}
        </div>
      )}
    </div>
  );
};

export default UserAccountPage;
