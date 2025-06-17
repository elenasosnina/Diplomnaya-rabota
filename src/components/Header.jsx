import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import companyLogo from "../assets/sound-wave.png";
import Dropdown from "./MenuSong";

const Header = ({ user, setUser, onSearchChange, searchQuery }) => {
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
        navigate("/settings", { state: { user } });
      },
    },
    {
      label: "Помощь",
      action: () => {
        handleNavigation("/help");
      },
    },
    {
      label: "Выйти",
      action: () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        handleNavigation("/main");
        window.location.reload();
      },
    },
  ];

  useEffect(() => {
    setVisible(!user);
  }, [location.pathname, user]);

  const handleChange = (e) => {
    const query = e.target.value;
    onSearchChange(query);
    if (query) {
      navigate("/search");
    }
  };
  const handleUserAccount = () => {
    navigate("/userAccount", { state: { user } });
  };
  return (
    <header className="header">
      <div className="logoName" onClick={() => handleNavigation("/main")}>
        <img className="logoName__image" src={companyLogo} alt="MyMusic logo" />
        <h1 className="logoName__heading">impulse</h1>
      </div>

      {!isVisible && (
        <div className="searchContainer">
          <input
            className="form-control"
            type="search"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={handleChange}
            style={{ minWidth: "700px" }}
          />
        </div>
      )}

      <div className="interanceButtons">
        {isVisible ? (
          <>
            <button
              className="interanceButtons__registration"
              onClick={() => handleNavigation("/registration")}
            >
              Зарегистрироваться
            </button>
            <button
              className="interanceButtons__login"
              onClick={() => handleNavigation("/login")}
            >
              Войти
            </button>
          </>
        ) : (
          <>
            {user && (
              <div className="userAccount" onClick={handleUserAccount}>
                <img
                  className="userAccount__image--profile"
                  src={user.PhotoProfile}
                  alt="Profile"
                />
                <p>{user.Nickname || "Пользователь"}</p>
              </div>
            )}
            <div className="menu" onClick={handleOpenMenu}></div>
            {isOpenMenu && (
              <div className="menu__item">
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
