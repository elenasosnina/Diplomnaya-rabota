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
  songs,
  setSongs,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleOpenModal = (modalType) => {
    setIsModalOpen(true);
    setCurrentModal(modalType);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
  };
  const location = useLocation();
  useEffect(() => {
    const item = location.state?.playlist;
    if (item) {
      setPlaylist(item);
    }
  }, [location.state]);
  const user = JSON.parse(localStorage.getItem("user"));
  const options = [
    {
      label: !playlist.liked ? "Добавить в избранное" : "Удалить из избранного",
      action: () => {
        !playlist.liked
          ? handleOpenModal("addToFav")
          : handleOpenModal("delFromFav");
        LikeChange();
      },
    },
  ];
  const LikeChange = async () => {
    if (!user || !playlist) return;

    try {
      const newLikedStatus = !playlist.liked;
      setPlaylist((prev) => ({ ...prev, liked: newLikedStatus }));
      const response = await fetch(
        `http://localhost:5000/api/playlist/likeChange/${playlist.PlaylistID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserID: user.UserID }),
        }
      );

      if (!response.ok) {
        setPlaylist((prev) => ({ ...prev, liked: !newLikedStatus }));
        throw new Error(`Ошибка: ${response.status}`);
      }

      const result = await response.json();

      setPlaylist((prev) => ({ ...prev, liked: result.liked }));
    } catch (error) {
      console.error("Ошибка при изменении статуса плейлиста:", error);
    }
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!playlist || !playlist.PlaylistID) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const url = `http://localhost:5000/api/playlists/songs/${playlist.PlaylistID}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserID: user.UserID }),
        });

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
              {currentModal === "addToFav" && (
                <ModalWindowInformation
                  onClose={handleCloseModal}
                  showCancelButton={false}
                  confirmButtonText={"Ок"}
                  onConfirm={handleCloseModal}
                  message={"Выбранный плейлист добавлен в Избранное"}
                />
              )}
              {currentModal === "delFromFav" && (
                <ModalWindowInformation
                  onClose={handleCloseModal}
                  showCancelButton={false}
                  confirmButtonText={"Ок"}
                  onConfirm={handleCloseModal}
                  message={"Выбранный плейлист удален из Избранного"}
                />
              )}
            </div>
          )}
          <div className="playlist-cover">
            <img src={playlist?.PhotoCover} alt="Cover" />
          </div>
          <div className="playlist-info">
            <p>
              <b>{playlist?.Title}</b>
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
              onLikeChange={onLikeChange}
              onSongSelect={onSongSelect}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PlaylistPage;
