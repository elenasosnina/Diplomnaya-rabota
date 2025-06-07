import React, { useState, useEffect, useRef, useContext } from "react";
import "./ModalWindows.css";
import { useNavigate } from "react-router-dom";
import vkimg from "../assets/icon2.png";
import tgimg from "../assets/icon1.png";
import styled from "styled-components";
import defoultPhoto from "../assets/UserBackgroundDefault.jpg";
import Songs from "../components/Songs";

const List = styled.ul`
  list-style-type: none;
  padding: 0px 15px 0px 0;
  margin: 0;
  height: 300px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 10px;
  height: 50px;
  color: ${({ isSelected }) =>
    isSelected ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"};
  background-color: ${({ isSelected }) =>
    isSelected ? "rgb(79, 15, 255)" : "rgb(255, 255, 255)"};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: rgba(157, 157, 157, 0.5);
    color: white;
  }
`;

const title = "Посмотрите этот замечательный контент!";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
};

const ShareModalWindow = ({ onClose, link }) => {
  const shareOnTelegram = () => {
    if (link) {
      const url = link;
      const titleText = title;
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(titleText)}`,
        "_blank"
      );
    } else {
      alert("Ссылка отсутствует");
    }
  };

  const shareOnVK = () => {
    if (link) {
      window.open(
        `https://vk.com/share.php?url=${encodeURIComponent(
          link
        )}&title=${encodeURIComponent(title)}`,
        "_blank"
      );
    } else {
      alert("Ссылка отсутствует");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="shareModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h1 className="heading">Поделиться</h1>
        <p>Делитесь любимыми треками со своими близкими</p>
        <div className="share-link">
          {link}
          <button className="copy-button" onClick={() => handleCopy(link)}>
            Копировать
          </button>
        </div>
        <div className="line"></div>
        <div className="sm-icons">
          <img onClick={shareOnVK} src={vkimg} alt="VK" />
          <img onClick={shareOnTelegram} src={tgimg} alt="Telegram" />
        </div>
      </div>
    </div>
  );
};

const AddToPlaylistModalWindow = ({
  onClose,
  isPlaying,
  currentSong,
  currentTime,
  toggleSongPlay,
  onLikeChange,
  onSongSelect,
  initialModal = "addIntoPlaylist",
  selectedPlaylist,
  song,
}) => {
  const [cover, setCover] = useState(defoultPhoto);
  const [image, setImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentModal, setCurrentModal] = useState(initialModal);
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [playlistSearchTerm, setPlaylistSearchTerm] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [filteredPlaylistItems, setFilteredPlaylistItems] =
    useState(playlistItems);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const user = localStorage.getItem("user");
  const modalRef = useRef(null);

  useEffect(() => {
    const getDataFavoriteSongs = async () => {
      try {
        const urlFavoriteSongs = `http://localhost:5000/api/favouriteSongs/${user}`;
        const res = await fetch(urlFavoriteSongs);
        if (res.ok) {
          let json = await res.json();
          setSongs(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    };
    getDataFavoriteSongs();

    const fetchData = async (playlistId) => {
      if (!playlistId) {
        return;
      }

      try {
        const url = `http://localhost:5000/api/playlists/songs/${playlistId}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlaylistSongs(data);
      } catch (e) {
        console.error("Ошибка при загрузке песен:", e);
      }
    };
    const urlMakePlaylists = `http://localhost:5000/api/makePlaylists/${user}`;
    const getDataMakePlaylists = async () => {
      try {
        const res = await fetch(urlMakePlaylists);
        if (res.ok) {
          let json = await res.json();
          setPlaylistItems(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    };
    getDataMakePlaylists();

    if (selectedPlaylist && selectedPlaylist.PlaylistID) {
      setCurrentPlaylistId(selectedPlaylist.PlaylistID);
      setCover(selectedPlaylist.PhotoCover || defoultPhoto);
      setPlaylistName(selectedPlaylist.Title);
      fetchData(selectedPlaylist.PlaylistID);
    } else {
      setCurrentPlaylistId(null);
      setCover(defoultPhoto);
      setPlaylistName("");
      setPlaylistSongs([]);
    }
  }, [selectedPlaylist, user]);

  useEffect(() => {
    const results = songs.filter((song) =>
      song.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(results);
  }, [songs, searchTerm]);

  useEffect(() => {
    const results = playlistItems.filter((item) =>
      item.Title.toLowerCase().includes(playlistSearchTerm.toLowerCase())
    );
    setFilteredPlaylistItems(results);
  }, [playlistItems, playlistSearchTerm]);

  const handleItemClick = (playlistId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(playlistId)) {
        return prevSelectedItems.filter((item) => item !== playlistId);
      } else {
        return [...prevSelectedItems, playlistId];
      }
    });
  };

  const handleImageClick = () => {
    document.getElementById("cover-picture-input").click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCover(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isSongSelected = (songId) => selectedSongs.includes(songId);

  const handleSongSelection = (songId) => {
    setSelectedSongs((prevSelected) => {
      if (prevSelected.includes(songId)) {
        return prevSelected.filter((id) => id !== songId);
      } else {
        return [...prevSelected, songId];
      }
    });
  };

  const handleAddSongsToPlaylist = () => {
    const songsToAdd = songs.filter((song) =>
      selectedSongs.includes(song.SongID)
    );
    setPlaylistSongs((prevPlaylistSongs) => [
      ...prevPlaylistSongs,
      ...songsToAdd,
    ]);
    setSelectedSongs([]);
    if (selectedPlaylist && selectedPlaylist.PlaylistID) {
      setCurrentModal("editPlaylist");
    } else {
      setCurrentModal("createPlaylist");
    }
  };

  const handleDeleteSelectedSongs = () => {
    setPlaylistSongs((prevPlaylistSongs) => {
      return prevPlaylistSongs.filter(
        (song) => !selectedSongs.includes(song.SongID)
      );
    });
    setSelectedSongs([]);
  };

  const sendData = async (playlistData, file) => {
    const url = "http://localhost:5000/api/createPlaylist";

    try {
      const formData = new FormData();
      formData.append("Title", playlistData.Title);
      formData.append("UserID", playlistData.UserID);
      formData.append("songs", JSON.stringify(playlistData.Songs));
      if (file) {
        formData.append("filedata", file);
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Ошибка:", data.error || data.message || "Unknown error");
      } else {
        setCover(defoultPhoto);
        setPlaylistName("");
        setPlaylistSongs([]);
        setCurrentModal("addIntoPlaylist");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const updateData = async (id, playlistData, file) => {
    const url = `http://localhost:5000/api/editPlaylist/${id}`;

    try {
      const formData = new FormData();
      formData.append("Title", playlistData.Title);
      formData.append("songs", JSON.stringify(playlistData.Songs));
      if (file) {
        formData.append("filedata", file);
      }

      const res = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Ошибка:", data.error || data.message || "Unknown error");
      } else {
        setCover(defoultPhoto);
        setPlaylistName("");
        setPlaylistSongs([]);
        onClose();
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleSavePlaylist = async () => {
    if (playlistName.trim() === "") {
      alert("Playlist name cannot be empty.");
      return;
    }

    const playlistData = {
      UserID: user,
      Title: playlistName,
      Songs: playlistSongs,
    };

    if (currentModal === "createPlaylist") {
      await sendData(playlistData, image);
    } else {
      await updateData(selectedPlaylist.PlaylistID, playlistData, image);
    }
  };

  const handleModalClose = () => {
    console.log(user);

    onClose();
  };

  const handleAddSongsModalClose = () => {
    if (currentPlaylistId) {
      setCurrentModal("editPlaylist");
    } else {
      setCurrentModal("createPlaylist");
    }
  };

  const renderSongs = (songsList) => {
    return songsList.map((song) => (
      <div
        key={song.SongID}
        style={{
          backgroundColor: isSongSelected(song.SongID)
            ? "rgba(157, 157, 157, 0.5)"
            : "transparent",
          cursor: "pointer",
          padding: "5px",
          borderRadius: "15px",
          width: "400px",
        }}
        onClick={() => handleSongSelection(song.SongID)}
      >
        <Songs
          key={song.SongID}
          song={song}
          isPlaying={isPlaying}
          currentSong={currentSong}
          currentTime={currentTime}
          toggleSongPlay={toggleSongPlay}
          onLikeChange={onLikeChange}
          onSongSelect={onSongSelect}
          isInAddToPlaylistModal={true}
        />
      </div>
    ));
  };
  const addSongIntoPlaylist = async (song, selectedItems) => {
    const url = `http://localhost:5000/api/playlists/songs/adding`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlists: selectedItems,
          song: song,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Не удалось добавить песню в плейлист"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  };

  const handleAddSelectedPlaylists = async () => {
    await addSongIntoPlaylist(song, selectedItems);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedItems([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div className="modal-overlay">
      <div className="addToPlaylistModalWindow" ref={modalRef}>
        <button className="close-button" onClick={handleModalClose}>
          ✕
        </button>
        {currentModal === "addIntoPlaylist" && (
          <div>
            <h1 className="heading">Добавить в плейлист</h1>
            <input
              className="playlist-search"
              type="search"
              placeholder="Поиск плейлистов..."
              value={playlistSearchTerm}
              onChange={(e) => setPlaylistSearchTerm(e.target.value)}
            />
            <List className="list-playlist">
              {filteredPlaylistItems.map((item) => (
                <ListItem
                  key={item.PlaylistID}
                  isSelected={selectedItems.includes(item.PlaylistID)}
                  onClick={() => handleItemClick(item.PlaylistID)}
                >
                  {item.Title}
                </ListItem>
              ))}
            </List>
            <div className="buttons-playlist">
              <button
                className="create-playlist"
                onClick={() => {
                  setCurrentModal("createPlaylist");
                  setCurrentPlaylistId(null);
                }}
              >
                Создать плейлист
              </button>
              <button
                className="save-playlist"
                onClick={handleAddSelectedPlaylists}
                disabled={selectedItems.length === 0}
              >
                Добавить
              </button>
            </div>
          </div>
        )}
        {(currentModal === "createPlaylist" ||
          currentModal === "editPlaylist") && (
          <div className="create-playlist-form">
            <h1 className="heading">
              {currentModal === "createPlaylist"
                ? "Создание плейлиста"
                : "Редактирование плейлиста"}
            </h1>
            <div className="photo-name-playlist">
              <img
                className="img-playlist"
                src={cover}
                alt="Playlist Cover"
                onClick={handleImageClick}
                style={{ cursor: "pointer" }}
              />
              <input
                type="file"
                id="cover-picture-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <input
                className="form-control"
                placeholder="Введите название плейлиста..."
                value={playlistName || ""}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>
            <br />
            <div className="added-songs-list">{renderSongs(playlistSongs)}</div>
            <div className="add-songs-form">
              <button
                className="create-playlist"
                style={{ fontSize: "20px", padding: "0 10px" }}
                onClick={() => setCurrentModal("addSongs")}
              >
                +
              </button>
              <p>Добавить песни из Избранного</p>
            </div>
            <div className="buttons-playlist">
              <button
                className="create-playlist"
                onClick={handleDeleteSelectedSongs}
                disabled={selectedSongs.length === 0}
              >
                Удалить
              </button>
              <button
                className="save-playlist"
                onClick={handleSavePlaylist}
                disabled={
                  playlistName.trim() === "" || playlistSongs.length === 0
                }
              >
                Сохранить
              </button>
            </div>
          </div>
        )}
        {currentModal === "addSongs" && (
          <div>
            <h1 className="heading">Добавить песни</h1>
            <div className="photo-name-playlist">
              <input
                className="form-control"
                placeholder="Введите название песни..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ margin: "30px 0px 10px 0px" }}
              />
              <div className="add-songs-list">{renderSongs(filteredSongs)}</div>
            </div>
            <div className="buttons-playlist">
              <button
                className="create-playlist"
                onClick={handleAddSongsModalClose}
              >
                Отмена
              </button>
              <button
                className="save-playlist"
                onClick={handleAddSongsToPlaylist}
              >
                Добавить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalWindowInformation = ({
  onClose,
  message,
  onConfirm,
  showCancelButton = true,
  confirmButtonText = "Подтвердить",
}) => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="warningModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <p className="heading">Внимание!</p>
        <div className="modal-message">{message}</div>
        <br />
        <div className="buttons-playlist">
          {showCancelButton && (
            <button className="create-playlist" onClick={onClose}>
              Отмена
            </button>
          )}
          {onConfirm ? (
            <button className="save-playlist" onClick={onConfirm}>
              {confirmButtonText}
            </button>
          ) : (
            <button
              className="save-playlist"
              onClick={() => {
                navigate("/main");
              }}
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ChangeLoginModal = ({ onClose, onSuccess }) => {
  const [login, setLogin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmationSubmit = (e) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="modal-overlay">
      <div className="creditsModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h1 className="heading">Изменить логин</h1>
        {!showConfirmation ? (
          <form onSubmit={handleSubmit} className="settings-form">
            <div>
              <p>
                Код подтверждения будет отправлен по адресу почты: @gmail.com{" "}
              </p>
              <label>Новый логин</label>
              <input
                type="text"
                className="form-control"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="buttons-playlist">
              <button className="create-playlist" onClick={onClose}>
                Отмена
              </button>
              <button className="save-playlist" type="submit">
                Подтвердить
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmationSubmit} className="settings-form">
            <div>
              <label>Ваш новый логин</label>
              <input
                type="text"
                className="form-control"
                value={login}
                readOnly
              />
            </div>
            <div>
              <label>Введите код подтверждения</label>
              <input
                type="text"
                className="form-control"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>
            <div className="buttons-playlist">
              <button className="create-playlist" onClick={onClose}>
                Отмена
              </button>
              <button className="save-playlist" type="submit">
                Подтвердить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    onSuccess();
  };

  return (
    <div className="modal-overlay">
      <div className="creditsModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h1 className="heading">Изменение пароля</h1>
        <form onSubmit={handleSubmit} className="settings-form">
          <div>
            <label>Введите текущий пароль</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Введите текущий пароль"
            />
          </div>
          <div>
            <label>Введите новый пароль</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
            />
          </div>
          <div>
            <label>Повторите новый пароль</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
            />
          </div>
          <div className="buttons-playlist">
            <button className="create-playlist" onClick={onClose}>
              Отмена
            </button>
            <button className="save-playlist" type="submit">
              Подтвердить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export {
  ShareModalWindow,
  AddToPlaylistModalWindow,
  ModalWindowInformation,
  ChangeLoginModal,
  ChangePasswordModal,
};
