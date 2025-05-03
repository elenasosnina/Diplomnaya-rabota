import React, { useState } from "react";
import "./ModalWindows.css";
import { useNavigate } from "react-router-dom";
import vkimg from "../assets/icon2.png";
import tgimg from "../assets/icon1.png";
import styled from "styled-components";

const List = styled.ul`
  list-style-type: none;
  padding: 0px 30px 0px 0;
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

const items = [
  "кпкавп",
  "134",
  "афыа",
  "кпкавп",
  "134",
  "кпкавп",
  "134",
  "афыа",
  "кпкавп",
  "134",
];

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
            <span className="purple-text">Исполнитель: </span> {song.artist}
          </label>
          <label>
            <span className="purple-text">Продюсер: </span> {song.producer}
          </label>
          <label>
            <span className="purple-text">Автор текста: </span>{" "}
            {song.authorLyrics}
          </label>
          <label>
            <span className="purple-text">Композитор: </span> {song.composer}
          </label>
          <label>
            <span className="purple-text">Права принадлежат: </span>{" "}
            {song.rights}
          </label>
        </div>
      </div>
    </div>
  );
};

const AddToPlaylistModalWindow = ({ onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  return (
    <div className="modal-overlay">
      <div className="addToPlaylistModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h1 className="heading">Добавить в плейлист</h1>
        <input
          className="playlist-search"
          type="search"
          placeholder="Поиск плейлистов..."
        />
        <List className="list-playlist">
          {items.map((item, index) => (
            <ListItem
              key={index}
              isSelected={selectedItem === index}
              onClick={() => handleItemClick(index)}
            >
              {item}
            </ListItem>
          ))}
        </List>
        <div className="buttons-playlist">
          <button className="create-playlist">Создать плейлист</button>
          <button className="save-playlist">Сохранить</button>
        </div>
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
                Код подтверждения будет отправлен по адресу почты: @gmail.com
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
