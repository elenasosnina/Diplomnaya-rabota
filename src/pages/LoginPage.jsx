import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginPicture from "../assets/login.jpg";
import emailPicture from "../assets/email.png";
import vkPicture from "../assets/icon2.png";
import "./RegistrationPage.css";
import * as RegistrationComponents from "./RegistrationPage.jsx";
const { ErrorText, TextBox, Label, Button } = RegistrationComponents;

const LoginPage = ({ users }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const sendData = async () => {
    const url = "http://localhost:5000/api/user/login";
    const data = {
      login: login,
      password: password,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setMessage("Неправильный логин или пароль. Повторите попытку!");
        setLoginError(true);
        setPasswordError(true);
      } else {
        handleNavigation("/main");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
    setLoginError(false);
    setMessage("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
    setMessage("");
  };

  const handleEnterence = () => {
    if (!login || !password) {
      setLoginError(true);
      setPasswordError(true);
      setMessage("Поля логина и пароля обязательны для заполнения");
      return;
    } else {
      sendData();
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <img
          className="loginCard__image--cover"
          src={loginPicture}
          alt="Обложка страницы авторизации"
        />
        <div className="loginForm">
          <div>
            <h1 className="loginForm__title" color="white">
              Авторизация
            </h1>
            {message ? (
              <ErrorText>{message}</ErrorText>
            ) : (
              <div
                style={{
                  height: "7px",
                }}
              />
            )}
          </div>

          <Label>Логин</Label>

          <TextBox
            type="text"
            placeholder="Введите логин"
            value={login}
            onChange={handleLoginChange}
            error={loginError}
          />

          <Label>Пароль</Label>
          <TextBox
            className="loginForm__input"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
          />
          <Button onClick={handleEnterence}>Войти</Button>
          <label
            className="loginForm__label--hyperlink"
            onClick={() => handleNavigation("/recoveryPassword")}
          >
            Забыли пароль? Восстановите пароль
          </label>
          <label
            className="loginForm__label--hyperlink"
            onClick={() => handleNavigation("/registration")}
          >
            Нет аккаунта? Создайте его
          </label>
          <div className="socialMediaLogin">
            <img
              src={emailPicture}
              alt="Войти через почту"
              className="socialMediaLogin__image"
            />
            <img
              src={vkPicture}
              alt="Войти через VK"
              className="socialMediaLogin__image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
