import React, { useState } from "react";
import "./ModalWindows.css";
import vkimg from "../assets/icon3.png";
import instaimg from "../assets/icon2.png";
import tgimg from "../assets/icon1.png";
import styled from "styled-components";

const List = styled.ul`
  list-style-type: none; /* Убираем маркеры для всего списка */
  padding: 0; /* Убираем отступы */
  margin: 0; /* Убираем отступы */
  height: 300px; /* Фиксированная высота для прокрутки */
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
  color: black;

  &:hover {
    background-color: rgba(157, 157, 157, 0.5); /* Эффект при наведении */
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

const ShareModalWindow = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="shareModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h1 className="heading">Поделиться</h1>
        <p>Делитесь любимыми треками со своими близкими</p>
        <div className="share-link">
          https://jfgdhufdg.ru/playlist/ewkhrueige4
        </div>
        <div className="line"></div>
        <div className="sm-icons">
          <img src={vkimg} alt="VK" />
          <img src={instaimg} alt="Instagram" />
          <img src={tgimg} alt="Telegram" />
        </div>
      </div>
    </div>
  );
};

const CreditsModalWindow = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="creditsModalWindow">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h1 className="heading">Сведения о песне</h1>
        <div className="credits-info">
          <label>Исполнитель:</label>
          <label>Продюсер:</label>
          <label>Автор текста:</label>
          <label>Композитор:</label>
          <label>Права принадлежат:</label>
        </div>
      </div>
    </div>
  );
};

const AddToPlaylistModalWindow = ({ onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null); // Переместили сюда

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
