import React, { useState, useEffect, useRef, useContext } from "react";
import "./ModalWindows.css";
import { useNavigate } from "react-router-dom";
import vkimg from "../assets/icon2.png";
import tgimg from "../assets/icon1.png";
import styled from "styled-components";
import defoultPhoto from "../assets/bibi.jpg";
import Songs from "../components/Songs";
import coverSong from "../assets/party.webp";
import coverSong2 from "../assets/login.jpg";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import audioCover2 from "../assets/Xxxtentacion_John_Cunningham_-_changes_54571393.mp3";

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

const CreditsModalWindow = ({ onClose, song }) => {
  return (
    <div className="modal-overlay">
      <div className="creditsModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <p className="heading">Сведения о песне</p>
        <div className="credits-info">
          <label>
            <span className="purple-text">Исполнитель: </span> {song?.artist}
          </label>
          <label>
            <span className="purple-text">Продюсер: </span> {song?.producer}
          </label>
          <label>
            <span className="purple-text">Автор текста: </span>{" "}
            {song?.authorLyrics}
          </label>
          <label>
            <span className="purple-text">Композитор: </span> {song?.composer}
          </label>
          <label>
            <span className="purple-text">Права принадлежат: </span>{" "}
            {song?.rights}
          </label>
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
  initialModal = "addIntoPlaylist", // Added initialModal prop
}) => {
  const [cover, setCover] = useState(defoultPhoto);
  const [selectedItems, setSelectedItems] = useState([]); // Use an array to store multiple selections
  const [currentModal, setCurrentModal] = useState(initialModal); // Initialize with initialModal prop
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [playlistSearchTerm, setPlaylistSearchTerm] = useState(""); // State for playlist search term
  const [songs, setSongs] = useState([
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

  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [filteredPlaylistItems, setFilteredPlaylistItems] =
    useState(playlistItems);

  const modalRef = useRef(null);

  useEffect(() => {
    const results = songs.filter((song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(results);
  }, [songs, searchTerm]);

  useEffect(() => {
    const results = playlistItems.filter((item) =>
      item.name.toLowerCase().includes(playlistSearchTerm.toLowerCase())
    );
    setFilteredPlaylistItems(results);
  }, [playlistItems, playlistSearchTerm]);

  const handleItemClick = (index) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(index)) {
        return prevSelectedItems.filter((item) => item !== index);
      } else {
        return [...prevSelectedItems, index];
      }
    });
  };

  const handleImageClick = (inputId) => () => {
    document.getElementById(inputId).click();
  };

  const handleImageChange = (setPicture) => (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setPicture(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCoverPictureChange = handleImageChange(setCover);
  const handleCoverPlaylistClick = handleImageClick("cover-picture-input");

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
    const songsToAdd = songs.filter((song) => selectedSongs.includes(song.id));
    setPlaylistSongs((prevPlaylistSongs) => [
      ...prevPlaylistSongs,
      ...songsToAdd,
    ]);
    setSelectedSongs([]);
    setCurrentModal("createPlaylist");
  };

  const handleDeleteSelectedSongs = () => {
    setPlaylistSongs((prevPlaylistSongs) => {
      return prevPlaylistSongs.filter(
        (song) => !selectedSongs.includes(song.id)
      );
    });
    setSelectedSongs([]);
  };

  const handleSavePlaylist = () => {
    if (playlistName.trim() !== "") {
      const newPlaylistItem = {
        name: playlistName,
        cover: cover,
        songs: [...playlistSongs],
      };
      setPlaylistItems((prevItems) => [...prevItems, newPlaylistItem]);
      setSelectedItems([playlistItems.length]);
      setPlaylistName("");
      setCover(defoultPhoto);
      setPlaylistSongs([]);
    }
    setCurrentModal("addIntoPlaylist");
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleAddSongsModalClose = () => {
    setCurrentModal("createPlaylist");
  };

  const renderSongs = (songsList) => {
    return songsList.map((song) => (
      <div
        key={song.id}
        style={{
          backgroundColor: isSongSelected(song.id)
            ? "rgba(157, 157, 157, 0.5)"
            : "transparent",
          cursor: "pointer",
          padding: "5px",
          borderRadius: "15px",
          width: "400px",
        }}
        onClick={() => handleSongSelection(song.id)}
      >
        <Songs
          key={song.id}
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

  const handleAddSelectedPlaylists = () => {
    const playlistsToAdd = selectedItems.map((index) => playlistItems[index]);
    console.log("Adding playlists:", playlistsToAdd);
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
              {filteredPlaylistItems.map((item, index) => (
                <ListItem
                  key={index}
                  isSelected={selectedItems.includes(index)}
                  onClick={() => handleItemClick(index)}
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
            <div className="buttons-playlist">
              <button
                className="create-playlist"
                onClick={() => setCurrentModal("createPlaylist")}
              >
                Создать плейлист
              </button>
              <button
                className="save-playlist"
                onClick={handleAddSelectedPlaylists}
              >
                Добавить
              </button>
            </div>
          </div>
        )}
        {currentModal === "createPlaylist" && (
          <div className="create-playlist-form">
            <h1 className="heading">Создание плейлиста</h1>
            <div className="photo-name-playlist">
              <img
                className="img-playlist"
                src={cover}
                alt="Playlist Cover"
                onClick={handleCoverPlaylistClick}
                style={{ cursor: "pointer" }}
              />
              <input
                type="file"
                id="cover-picture-input"
                accept="image/*"
                onChange={handleCoverPictureChange}
                style={{ display: "none" }}
              />
              <input
                className="form-control"
                placeholder="Введите название плейлиста..."
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>
            <hr />
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
              >
                Удалить
              </button>
              <button className="save-playlist" onClick={handleSavePlaylist}>
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
        <div>{message}</div>
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
  CreditsModalWindow,
  AddToPlaylistModalWindow,
  ModalWindowInformation,
  ChangeLoginModal,
  ChangePasswordModal,
};
