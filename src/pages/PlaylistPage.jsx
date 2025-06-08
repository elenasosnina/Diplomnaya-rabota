import React, { useState, useRef, useCallback, useEffect } from "react";
import "./PlaylistPage.css";
import Songs from "../components/Songs";
import Dropdown from "../components/MenuSong";
import { useLocation } from "react-router-dom";
import {
  ShareModalWindow,
  ModalWindowInformation,
} from "../components/ModalWindows";

const PlaylistPage = ({
  isPlaying,
  currentSong,
  currentTime,
  toggleSongPlay,
  onLikeChange,
  audioRef,
  onSongSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLikeChangeInternal = (songId, newLiked) => {
    const updatedSongs = songs.map((song) =>
      song.SongID === songId ? { ...song, liked: newLiked } : song
    );
    setSongs(updatedSongs);
  };

  const location = useLocation();
  const playlist = location.state?.playlist;
  useEffect(() => {
    const fetchData = async () => {
      if (!playlist || !playlist.PlaylistID) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const url = `http://localhost:5000/api/playlists/songs/${playlist.PlaylistID}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSongs(data);
      } catch (e) {
        console.error("Ошибка при загрузке песен:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playlist]);

  const LoadingIndicator = () => (
    <div className="search-process">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <main className="tracklist-page">
      <div className="card-tracklist">
        <div className="card-info">
          <div
            className="block-menu-playlist"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="menu-playlist"></div>
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
          {isModalOpen && (
            <div className="modal-overlay">
              {currentModal === "share" && (
                <ShareModalWindow onClose={handleCloseModal} link={"hgvg"} />
              )}
              {currentModal === "addToFav" && (
                <ModalWindowInformation
                  onClose={handleCloseModal}
                  showCancelButton={false}
                  confirmButtonText={"Ок"}
                  onConfirm={handleCloseModal}
                  message={"Выбранный плейлист добавлен в Избранное"}
                />
              )}
            </div>
          )}
          <div className="playlist-cover">
            <img src={playlist?.PhotoCover} alt="Cover" />
            <div className="listen-counter">{playlist?.FavoriteCounter}</div>
          </div>
          <div className="playlist-info">
            <p>
              <b>{playlist?.Title}</b>
            </p>
            <p style={{ fontSize: "18px", marginTop: "30px" }}>
              {playlist?.Duration || "0"}
            </p>
            <p style={{ fontSize: "25px", marginTop: "0px" }}>
              {playlist?.Nickname}
            </p>
          </div>
        </div>
        <div className="tracklist">
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
    </main>
  );
};

export default PlaylistPage;
