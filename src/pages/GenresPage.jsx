import React, { useState, useEffect } from "react";
import "./GenresPage.css";
import { useLocation } from "react-router-dom";
import coverSong from "../assets/party.webp";
import coverSong2 from "../assets/login.jpg";
import Songs from "../components/Songs";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import audioCover2 from "../assets/Xxxtentacion_John_Cunningham_-_changes_54571393.mp3";

const GenresPage = ({
  isPlaying,
  currentSong,
  currentTime,
  duration,
  toggleSongPlay,
  onLikeChange,
  onSongSelect,
}) => {
  const location = useLocation();
  const genre = location.state?.genreItem;
  const [songs, setSongs] = useState([]);
  const [initialSongs, setInitialSongs] = useState([
    {
      id: 1,
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
      id: 2,
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
    {
      id: 3,
      title: "Another Song",
      artist: "Some Artist",
      audio: audioCover,
      cover: coverSong,
      liked: false,
      producer: "jkj",
      authorLyrics: "hjh",
      composer: "jikj",
      rights: "khj",
      lyrics: "cklgf",
      duration: "02:22",
      url: "https://jfgdhufdg.ru/playlist/000hkjf",
    },
    {
      id: 4,
      title: "Yet Another Song",
      artist: "Different Artist",
      audio: audioCover2,
      cover: coverSong2,
      liked: false,
      producer: "jk32421j",
      authorLyrics: "h32421jh",
      composer: "j3241ikj",
      rights: "k343hj",
      lyrics: "ckl3432gf",
      duration: "02:32",
      url: "https://jfgdhufdg.ru/playlist/ewkhrueige4",
    },
  ]);

  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  if (!genre) {
    return <div>No genre selected.</div>;
  }

  return (
    <div className="songs-genre-list">
      <div className="genre-container">
        <img className="genre-cover" src={coverSong} alt="Genre Cover" />
        <h1 className="title-genre">{genre.title}</h1>
      </div>
      <div className="genre-song-list">
        {songs &&
          songs.map((song) => (
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
    </div>
  );
};

export default GenresPage;
