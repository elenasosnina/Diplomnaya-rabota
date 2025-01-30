import React, { useState } from "react";
import "./Header.css"; // Импортируйте стили, если они есть
import companyLogo from "C:/Users/user/diplomnaya-rabota/src/assets/sound-wave.png";
const Header = () => {
  return (
    <div className="header">
      <div className="logo-name">
        <img className="logo-img" src={companyLogo} alt="MyMusic. logo"></img>
        <h1 className="name" style={{ fontSize: 40 }}>
          impulse
        </h1>
      </div>
      <div>
        <input className="search" type="text" placeholder="Поиск..." />
      </div>
      <div className="buttons">
        <button id="sign-up">Зарегистрироваться</button>
        <button id="log-in">Войти</button>
        <div className="menu"></div>
      </div>
    </div>
  );
};
export default Header;
