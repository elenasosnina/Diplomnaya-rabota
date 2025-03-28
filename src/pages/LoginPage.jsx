import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginLogo from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/login.jpg";
import emailPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/email.png";
import vkPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon2.png";
const LoginPage = ({ users }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleNavigation = (path) => {
    navigate(path);
  };
  const inputLoginRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleEnterence = () => {
    users.map((user) => {
      if (user.login === login && user.password === password) {
        alert("заебок");
        handleNavigation("/main");
      } else {
        inputLoginRef.current.style.border = "1px solid red";
        inputPasswordRef.current.style.border = "1px solid red";
        setMessage("Неправильный логин или пароль. Повторите попытку!");
      }
    });
  };
  return (
    <div className="page-log-in">
      <div className="card-log-in">
        <img className="card-image" src={loginLogo} alt="logo"></img>
        <div className="card-log-in-form">
          <h1 className="card-title" color="white">
            Авторизация
          </h1>
          {message && (
            <p
              style={{
                backgroundColor: "red",
                borderRadius: "20px",
                color: "white",
              }}
            >
              {message}
            </p>
          )}
          <label className="lables">Логин</label>

          <input
            className="card-textbox-login"
            type="text"
            placeholder="Введите логин"
            value={login}
            onChange={handleLoginChange}
            ref={inputLoginRef}
          />

          <label className="lables">Пароль</label>
          <input
            className="card-textbox-password"
            type="text"
            placeholder="Введите пароль"
            value={password}
            onChange={handlePasswordChange}
            ref={inputPasswordRef}
          />
          <button className="card-btn" onClick={handleEnterence}>
            Войти
          </button>
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
