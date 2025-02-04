import React, { useState } from "react";
import "./Main.css";
import PartyImage from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/party.webp";
const Main = () => {
  return (
    <div className="main">
      <div className="introduction">
        <h1 className="description">
          что такое impulse? это музыкальный сервис, работающий без ограничений.
          В данном сервисе собраны все самые топовые артисты.
        </h1>
        <h1 className="title">impulse</h1>
      </div>
      <div className="gallery">
        <img className="ImgParty" src={PartyImage}></img>
      </div>
      <div className="advantages">
        <h1 className="name-adv">Преимущества</h1>
        <div id="card">
          <ul className="list">
            <li>
              {
                "Вы получите доступ к миллионам треков из различных жанров и эпох"
              }
            </li>
            <li>
              {
                "Наши умные алгоритмы анализируют ваши предпочтения и предлагают музыку, которая вам действительно понравится"
              }
            </li>
            <li>
              {
                "Наслаждайтесь эксклюзивными альбомами, живыми записями и специальными плейлистами, созданными нашими экспертами"
              }
            </li>
            <li>
              {
                "Наш интуитивно понятный интерфейс позволяет легко находить и слушать вашу любимую музыку"
              }
            </li>
            <li>
              {
                "Поделитесь своими любимыми треками с друзьями и следите за их музыкальными предпочтениями"
              }
            </li>
          </ul>
        </div>
      </div>
      <div className="join-in">
        <h1 className="invite">Начни путь музыки с нашего сервиса impulse</h1>
        <button id="join">Присоединяйтесь</button>
      </div>
    </div>
  );
};
export default Main;
