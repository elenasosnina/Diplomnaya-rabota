import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import companyLogo from "C:/Users/user/diplomnaya-rabota/src/assets/sound-wave.png";

const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="header">
      <div className="logo-name">
        <img className="logo-img" src={companyLogo} alt="MyMusic logo" />
        <h1 className="name">impulse</h1>
      </div>
      <div className="search-container">
        {<input className="search" type="text" placeholder="Поиск..." />}
      </div>
      <div className="buttons">
        <button
          className="header-sign-up"
          onClick={() => handleNavigation("/registration")}
        >
          Зарегистрироваться
        </button>
        <button
          className="header-log-in"
          onClick={() => handleNavigation("/login")}
        >
          Войти
        </button>
        <div className="menu"></div>
      </div>
    </header>
  );
};

export default Header;
