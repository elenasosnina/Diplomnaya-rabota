import React, { useState } from "react";
import "./Songs.css";
import Dropdown from "./MenuSong";
import play from "../assets/play.png";
import pause from "../assets/pause.png";

import {
  ShareModalWindow,
  CreditsModalWindow,
  AddToPlaylistModalWindow,
} from "./ModalWindows";

const Songs = ({
  song,
  isPlaying,
  currentSong,
  currentTime,
  toggleSongPlay,
  onLikeChange,
  onSongSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "00:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOpenModal = (modalType) => {
    console.log(`Открытие модального окна: ${modalType}`);
    setIsModalOpen(true);
    setCurrentModal(modalType);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
  };

  const options = [
    {
      label: "Поделиться",
      action: () => {
        console.log("Поделиться нажато");
        handleOpenModal("share");
      },
    },
    {
      label: "Посмотреть сведения",
      action: () => {
        console.log("Посмотреть сведения нажато");
        handleOpenModal("credits");
      },
    },
    {
      label: "Добавить в плейлист",
      action: () => {
        console.log("Добавить в плейлист нажато");
        handleOpenModal("addToPlaylist");
      },
    },
  ];

  const likeClick = () => {
    onLikeChange(song.id, !song.liked);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isThisSongPlaying = currentSong && currentSong.id === song.id;

  return (
    <div className="card-song">
      <div className="cover-title-song">
        <div className="cover-container" onClick={() => toggleSongPlay(song)}>
          <img
            className="cover"
            src={song.cover}
            height={"50px"}
            width={"50px"}
            alt="Cover"
          />
          {isPlaying && currentSong.id === song.id ? (
            <img
              className="play-pause-icon"
              src={pause}
              alt="pause"
              onClick={(e) => {
                e.stopPropagation();
                toggleSongPlay(song);
              }}
            />
          ) : (
            <img
              className="play-pause-icon"
              src={play}
              alt="play"
              onClick={(e) => {
                e.stopPropagation();
                toggleSongPlay(song);
              }}
            />
          )}
        </div>
        <div className="title-singer">
          <p>{song.artist}</p>
          <p>{song.title}</p>
        </div>
      </div>

      <div className="timing-menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill={song.liked ? "black" : "none"}
          stroke="black"
          strokeWidth="1"
          onClick={likeClick}
          style={{ cursor: "pointer" }}
          className="hidden-svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="hidden-svg"
          style={{ padding: "15px 0px 0px 0px" }}
          width="60"
          height="50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <circle cx="10" cy="10" r="5" fill="black" />
          <circle cx="25" cy="10" r="5" fill="black" />
          <circle cx="40" cy="10" r="5" fill="black" />
        </svg>

        <p>{isThisSongPlaying ? formatTime(currentTime) : song.duration}</p>

        {isHovered && (
          <div
            className="menu-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Dropdown options={options} />
          </div>
        )}
        {isModalOpen && (
          <div className="modal-overlay">
            {currentModal === "share" && (
              <ShareModalWindow onClose={handleCloseModal} link={song.url} />
            )}
            {currentModal === "credits" && (
              <CreditsModalWindow onClose={handleCloseModal} song={song} />
            )}
            {currentModal === "addToPlaylist" && (
              <AddToPlaylistModalWindow onClose={handleCloseModal} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs;
