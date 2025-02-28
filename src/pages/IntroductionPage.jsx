import React, { useState } from "react";
import "./IntroductionPage.css";
import PartyImage from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/party.webp";
const advantagesList = [
  "Вы получите доступ к миллионам треков из различных жанров и эпох",
  "Наши умные алгоритмы анализируют ваши предпочтения и предлагают музыку, которая вам действительно понравится",
  "Наслаждайтесь эксклюзивными альбомами, живыми записями и специальными плейлистами, созданными нашими экспертами",
  "Наш интуитивно понятный интерфейс позволяет легко находить и слушать вашу любимую музыку",
  "Поделитесь своими любимыми треками с друзьями и следите за их музыкальными предпочтениями",
];
const IntroductionPage = () => {
  return (
    <div className="main">
      <div className="introduction">
        <h1 className="description">
          что такое impulse? это музыкальный сервис, работающий без ограничений.
          <br />В данном сервисе собраны все самые топовые артисты.
        </h1>
        <h1 className="title">impulse</h1>
      </div>

      <div className="gallery">
        <img className="ImgParty" src={PartyImage} alt="Party"></img>
      </div>

      <div className="advantages">
        <h1 className="name-adv">Преимущества</h1>
        <div className="card-advantages">
          <ul className="list">
            {advantagesList.map((advantage, index) => (
              <li key={index}>{advantage}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="join-in">
        <h1 className="invite">Начни путь музыки с нашего сервиса impulse</h1>
        <button className="join-button">Присоединяйтесь</button>
      </div>
    </div>
  );
};
export default IntroductionPage;
