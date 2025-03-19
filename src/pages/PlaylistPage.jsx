import React, { useState, useRef } from "react";
import "./PlaylistPage.css";
import Songs from "../components/Songs";
import coverPlaylist from "../assets/login.jpg";
import Dropdown from "../components/MenuSong";
import coverSong from "../assets/party.webp";
import coverSong2 from "../assets/login.jpg";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import audioCover2 from "../assets/Xxxtentacion_John_Cunningham_-_changes_54571393.mp3";

const PlaylistPage = ({
  onSongSelect,
  isPlaying,
  currentSong,
  currentTime,
  duration,
  audioRef,
  toggleSongPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "All Around The World",
      artist: "Justin Bieber",
      audio: audioCover,
      cover: coverSong,
    },
    {
      id: 2,
      title: "change",
      artist: "XXXTENTACION",
      audio: audioCover2,
      cover: coverSong2,
    },
    {
      id: 3,
      title: "Another Song",
      artist: "Some Artist",
      audio: audioCover,
      cover: coverSong,
    },
    {
      id: 4,
      title: "Yet Another Song",
      artist: "Different Artist",
      audio: audioCover2,
      cover: coverSong2,
    },
  ]);

  const options = [
    {
      label: "Поделиться",
      action: () => {
        console.log("Поделиться нажато");
      },
    },
    {
      label: "Посмотреть сведения",
      action: () => {
        console.log("Посмотреть сведения нажато");
      },
    },
    {
      label: "Добавить в плейлист",
      action: () => {
        console.log("Добавить в плейлист нажато");
      },
    },
  ];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <main className="tracklist-page">
      <div className="card-tracklist">
        <div className="card-info">
          <div
            className="block-menu-playlist"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="menu-playlist"></button>
          </div>
          {isHovered && (
            <div
              className="dropdown-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Dropdown options={options} />
            </div>
          )}
          <div className="playlist-cover">
            <img src={coverPlaylist} alt="Cover" />
            <div className="listen-counter">204</div>
          </div>
          <div className="playlist-info">
            <p>
              <b>Billie Eilish</b>
            </p>
            <p style={{ fontSize: "18px", marginTop: "30px" }}>4 ч 32 м</p>
            <p style={{ fontSize: "25px", marginTop: "0px" }}>user1</p>
          </div>
        </div>
        <div className="tracklist">
          {songs.map((song) => (
            <Songs
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              toggleSongPlay={toggleSongPlay}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PlaylistPage;
