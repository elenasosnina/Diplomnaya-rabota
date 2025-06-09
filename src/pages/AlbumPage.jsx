import React, { useState, useEffect } from "react";
import "./AlbumPage.css";
import Dropdown from "../components/MenuSong";
import Songs from "../components/Songs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShareModalWindow,
  ModalWindowInformation,
} from "../components/ModalWindows";

const AlbumPage = ({
  isPlaying,
  currentSong,
  currentTime,
  duration,
  toggleSongPlay,
  onLikeChange,
  audioRef,
  onSongSelect,
  songs,
  setSongs,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const handleOpenModal = (modalType) => {
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
        handleOpenModal("share");
      },
    },
    {
      label: "Добавить в избранное",
      action: () => {
        handleOpenModal("addToFav");
      },
    },
  ];

  const handleLikeChangeInternal = (songId) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.SongID === songId ? { ...song, liked: !song.liked } : song
      )
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const location = useLocation();
  const album = location.state?.album;
  useEffect(() => {
    const fetchData = async () => {
      if (!album || !album.AlbumID) {
        return;
      }

      try {
        const url = `http://localhost:5000/api/albums/songs/${album.AlbumID}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSongs(data);
      } catch (e) {
        console.error("Ошибка при загрузке песен:", e);
      }
    };

    fetchData();
  }, [album]);
  return (
    <div className="main-al">
      <div className="album-component">
        <div className="album-cover">
          <img
            className="main-cover-album"
            src={album.PhotoCover}
            alt="Album Cover"
          />
          <div
            className="block-menu-album"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="menu-album"></div>
          </div>
          {isHovered && (
            <div
              className="dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Dropdown options={options} />
            </div>
          )}
          {currentModal === "share" && (
            <ShareModalWindow onClose={handleCloseModal} link={album.url} />
          )}
          {currentModal === "addToFav" && (
            <ModalWindowInformation
              onClose={handleCloseModal}
              showCancelButton={false}
              confirmButtonText={"Ок"}
              onConfirm={handleCloseModal}
              message={"Выбранный альбом добавлен в Избранное"}
            />
          )}
          <div className="main-timing">1ч 24м</div>
        </div>
        <div className="album-page-info">
          <div className="album-page-tracklist">
            <h1>{album.Title}</h1>
            {songs.map((song) => (
              <Songs
                key={song.SongID}
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
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
