import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SingerPage.css";
import singerCover from "../assets/bibi.jpg";
import singerBack from "../assets/bibi_back.jpg";
import coverSong from "../assets/party.webp";
import coverSong2 from "../assets/login.jpg";
import Bheart from "../assets/Bheart.png";
import Wheart from "../assets/Wheart.png";
import Songs from "../components/Songs";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import audioCover2 from "../assets/Xxxtentacion_John_Cunningham_-_changes_54571393.mp3";
import Media from "../components/Media";
import { useNavigate } from "react-router-dom";

const SingerPage = ({
  isPlaying,
  currentSong,
  currentTime,
  duration,
  toggleSongPlay,
  onLikeChange,
  audioRef,
  setSongs,
  songs,
  onSongSelect,
}) => {
  const [IsClicked, setClicked] = useState(false);
  const likedArtist = () => {
    setClicked(!IsClicked);
  };

  const [singer, setSinger] = useState({
    id: 10,
    biography:
      "jgk gfbyi ftyif gkgnkgyuk gy ukgyukgyugyu gi kyug yukgyugk jgk gfbyi ftyif gkgnkgyuk gy ukgyukgyugyu gi kyug yukgyugk jgk gfbyi ftyif gkgnkgyuk gy ukgyukgyugyu gi kyug yukgyugk ",
    nickname: "BIBI",
    photo: singerCover,
    subcribers: 98,
    country: "South Korea",
    backgroundPhoto: singerBack,
  });
  const [collaboration, setCollaboration] = useState([
    {
      id: 21,
      title: "fuiesjcufmev",
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
    {
      id: 12,
      title: "change",
      artist: "XXXTENTACION",
      audio: audioCover2,
      cover: coverSong2,
      liked: true,
      producer: "htfshfjh",
      authorLyrics: "24321413243",
      composer: "4321532413",
      rights: "324",
      lyrics: "32414",
      duration: "02:02",
      url: "https://jfgdhufdg.ru/playlist/fdgs41",
    },
  ]);

  const [isLiked, setIsLiked] = useState(false);
  const heartRef = useRef(null);

  useEffect(() => {
    setSongs(initialSongs);
  }, [setSongs, initialSongs]);

  const handleSongChange = useCallback(
    (newSong) => {
      if (currentSong && currentSong.id === newSong.id) {
        toggleSongPlay();
      } else {
        toggleSongPlay(newSong);
        onSongSelect(newSong);
      }
    },
    [currentSong, toggleSongPlay, onSongSelect]
  );

  const handleLikeChangeInternal = useCallback(
    (songId, newLiked) => {
      const updatedSongs = songs.map((song) =>
        song.id === songId
          ? {
              ...song,
              liked: newLiked,
            }
          : song
      );
      setSongs(updatedSongs);
    },
    [songs, setSongs]
  );

  const likeClick = () => {
    setIsLiked(!isLiked);
  };

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="singerPage">
      <div className="cover-singerPage">
        <img
          className="background-singerPage"
          src={singer.backgroundPhoto}
          alt="Singer Background"
        />
        <div className="photoes-artist">
          <img src={singer.photo} alt="Singer Cover" />
          <div
            className="btn-add"
            onClick={likedArtist}
            style={{
              backgroundColor: IsClicked ? "#4f0fff" : "white",
            }}
          >
            {IsClicked ? (
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
            {singer.nickname}
          </h1>
        </div>
      </div>
      <div className="songs-singerPage">
        <div className="songCol">
          {songs.slice(0, 6).map((song) => (
            <Songs
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChangeInternal}
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
                key={album.id}
                item={album}
                type="album"
                onClick={() =>
                  navigate("/album", {
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
              navigate("/albumList", {
                state: {
                  albums: albums,
                  name: "Альбомы",
                },
              })
            }
          >
            Больше
          </button>
        </div>
      </div>
      <div className="collaboration-singerPage">
        <p> Коллаборации </p>
        <div className="collection-collaborations">
          <div className="albums-covers">
            {collaboration.slice(0, 6).map((collab) => (
              <Media
                key={collab.id}
                item={collab}
                type="album"
                onClick={() =>
                  navigate("/album", {
                    state: {
                      album: collab,
                    },
                  })
                }
              />
            ))}
          </div>
          <button
            className="album-more"
            onClick={() =>
              navigate("/albumList", {
                state: {
                  albums: collaboration,
                  name: "Коллаборации",
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
          <h2> Об исполнителе </h2> <p> {singer.biography} </p>
        </div>
        <img
          src={coverSong}
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
