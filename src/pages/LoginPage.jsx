import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginLogo from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/login.jpg";
import emailPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/email.png";
import vkPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon2.png";
const LoginPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="page-log-in">
      <div className="card-log-in">
        <img className="card-image" src={loginLogo} alt="logo"></img>
        <div className="card-log-in-form">
          <h1 className="card-title" color="white">
            Авторизация
          </h1>
          <label className="lables">Логин</label>
          <input
            className="card-textbox-login"
            type="text"
            placeholder="Введите логин"
          />
          <label className="lables">Пароль</label>
          <input
            className="card-textbox-password"
            type="text"
            placeholder="Введите пароль"
          />
          <button className="card-btn">Войти</button>
          <label className="hyperlink">
            Забыли пароль? Восстановите пароль
          </label>
          <label
            className="hyperlink"
            onClick={() => handleNavigation("/registration")}
          >
            Нет аккаунта? Создайте его
          </label>
          <div className="login-with">
            <img
              arc="Войти через почту"
              className="emailPicture"
              src={emailPicture}
            />
            <img arc="Войти через VK" className="vkPicture" src={vkPicture} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
