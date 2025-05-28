import React from "react";
import "./IntroductionPage.css";
import CoverImage from "../assets/party.webp";
import { useNavigate } from "react-router-dom";

const advantagesList = [
  "Вы получите доступ к миллионам треков из различных жанров и эпох",
  "Наши умные алгоритмы анализируют ваши предпочтения и предлагают музыку, которая вам действительно понравится",
  "Наслаждайтесь эксклюзивными альбомами, живыми записями и специальными плейлистами, созданными нашими экспертами",
  "Наш интуитивно понятный интерфейс позволяет легко находить и слушать вашу любимую музыку",
  "Поделитесь своими любимыми треками с друзьями и следите за их музыкальными предпочтениями",
];

const IntroductionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="introductionPage">
      <div className="intro">
        <div className="intro__content">
          <h1 className="intro__title">impulse</h1>
          <h1 className="intro__description">
            что такое impulse? это музыкальный сервис, работающий без
            ограничений.
            <br />В данном сервисе собраны все самые топовые артисты.
          </h1>
        </div>
      </div>

      <div className="cover">
        <img className="cover__image" src={CoverImage} alt="Cover"></img>
      </div>

      <div className="advantages">
        <h1 className="advantages__heading">Преимущества</h1>
        <div className="advantages__card">
          <ul className="advantages__card-item">
            {advantagesList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="invitation">
        <h1 className="invitation__heading">
          Начни путь музыки с нашего сервиса impulse
        </h1>
        <button
          className="invitation__button"
          onClick={() => navigate("/registration")}
        >
          Присоединяйтесь
        </button>
      </div>
    </div>
  );
};
export default IntroductionPage;
