import React from "react";
import "./ModalWindows.css";
import vkimg from "../assets/icon2.png";
import tgimg from "../assets/icon1.png";
import styled from "styled-components";
import { useState } from "react";

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 300px;
  overflow-y: auto;
`;
const ListItem = styled.li`
  margin: 0;
  padding: 10px;
  height: 50px;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgb(209, 207, 205)" : "rgb(223, 223, 223)"};
  border: none;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(157, 157, 157, 0.5);
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

const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Ошибка:", err);
  }
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
        <h1 className="heading">Сведения о песне</h1>
        <div className="credits-info">
          <label>
            <span className="purple-text">Исполнитель: </span>
            {song.artist}
          </label>
          <label>
            <span className="purple-text">Продюсер: </span>
            {song.producer}
          </label>
          <label>
            <span className="purple-text">Автор текста: </span>
            {song.authorLyrics}
          </label>
          <label>
            <span className="purple-text">Композитор: </span>
            {song.composer}
          </label>
          <label>
            <span className="purple-text">Права принадлежат: </span>
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
export { ShareModalWindow, CreditsModalWindow, AddToPlaylistModalWindow };
