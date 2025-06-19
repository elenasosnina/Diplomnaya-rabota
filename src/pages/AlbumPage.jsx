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
  const [album, setAlbum] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
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
    const item = location.state?.album;
    if (item) {
      setAlbum(item);
    }
  }, [location.state]);
  const options = [
    {
      label: album.liked ? "Удалить из избранного" : "Добавить в избранное",
      action: () => {
        album.liked
          ? handleOpenModal("delFromFav")
          : handleOpenModal("addToFav");
        LikeChange();
      },
    },
  ];
  const LikeChange = async () => {
    if (!user || !album) return;

    try {
      const newLikedStatus = !album.liked;
      setAlbum((prev) => ({ ...prev, liked: newLikedStatus }));
      const response = await fetch(
        `http://localhost:5000/api/album/likeChange/${album.AlbumID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ UserID: user.UserID }),
        }
      );

      if (!response.ok) {
        setAlbum((prev) => ({ ...prev, liked: !newLikedStatus }));
        throw new Error(`Ошибка: ${response.status}`);
      }

      const result = await response.json();

      setAlbum((prev) => ({ ...prev, liked: result.liked }));
    } catch (error) {
      console.error("Ошибка при изменении статуса альбома:", error);
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
      if (!album || !album.AlbumID) {
        return;
      }

      try {
        const url = `http://localhost:5000/api/albums/songs/${album.AlbumID}`;
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
          {currentModal === "addToFav" && (
            <ModalWindowInformation
              onClose={handleCloseModal}
              showCancelButton={false}
              confirmButtonText={"Ок"}
              onConfirm={handleCloseModal}
              message={"Выбранный альбом добавлен в Избранное"}
            />
          )}
          {currentModal === "delFromFav" && (
            <ModalWindowInformation
              onClose={handleCloseModal}
              showCancelButton={false}
              confirmButtonText={"Ок"}
              onConfirm={handleCloseModal}
              message={"Выбранный альбом удален из Избранного"}
            />
          )}
          <div className="main-timing"></div>
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
                onLikeChange={onLikeChange}
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
