import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import companyLogo from "C:/Users/user/diplomnaya-rabota/src/assets/sound-wave.png";
import userFace from "../assets/bibi.jpg";
import Dropdown from "./MenuSong";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNavigation = (path) => {
    navigate(path);
  };
  const [isVisible, setVisible] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => {
    setOpenMenu(!isOpenMenu);
  };
  useEffect(() => {
    setOpenMenu(false);
  }, [location]);
  const options = [
    {
      label: "Настройки",
      action: () => {
        handleNavigation("/settings");
      },
    },
    {
      label: "Помощь",
      action: () => {
        handleNavigation("/help");
      },
    },
    {
      label: "Справка",
      action: () => {
        handleNavigation("/websiteInfo");
      },
    },
    {
      label: "Выйти",
      action: () => {
        handleNavigation("/main");
      },
    },
  ];
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/main") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location.pathname]);
  return (
    <header className="header">
      <div className="logo-name" onClick={() => handleNavigation("/main")}>
        <img className="logo-img" src={companyLogo} alt="MyMusic logo" />
        <h1 className="name">impulse</h1>
      </div>
      {isVisible ? (
        <></>
      ) : (
        <div className="search-container">
          {<input className="search" type="text" placeholder="Поиск..." />}
        </div>
      )}

      <div className="buttons">
        {isVisible ? (
          <>
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
            )
          </>
        ) : (
          <>
            <div
              className="user-account"
              onClick={() => handleNavigation("/userAccount")}
            >
              <img className="user-profile-photo" src={userFace} />
              <p>fghjgfyjkgujk</p>
            </div>
            <div className="menu" onClick={handleOpenMenu}></div>
            {isOpenMenu && (
              <div className="header-menu-dropdown">
                <Dropdown options={options} />
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
