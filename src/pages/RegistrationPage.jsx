import React, { useState } from "react";
import "./RegistrationPage.css";
import { useNavigate } from "react-router-dom";
import emailPicture from "../assets/email.png";
import vkPicture from "../assets/icon2.png";
import styled from "styled-components";
import Main from "./MainPage";
import defaultImage from "../assets/profile.webp";

const Button = styled.button`
  margin: 5px 16px 24px 16px;
  height: 50px;
  color: #ffffff;
  background-color: #4f0fff;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const TextBox = styled.input`
  margin: 10px 16px 15px 16px;
  border-radius: 10px;
  border: 2px solid
    ${(props) => (props.error ? "rgb(255, 15, 111)" : "#4f0fff")};
  padding: 10px;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  font-size: 18px;

  ${(props) =>
    props.error &&
    `box-shadow: rgb(255, 15, 111) 0px 0px 10px;
  `}
`;

const Label = styled.label`
  font-size: 14px;
  display: flex;
  justify-self: left;
  margin-left: 32px;
`;

const ErrorText = styled.div`
  color: rgb(255, 15, 111);
  font-size: 10px;
  margin-top: -8px;
`;

const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { component: RegistrationEmail },
    { component: RegistrationLoginPassword },
    { component: RegistrationProfile },
  ];
  const CurrentBlock = steps[currentStep].component;

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  return (
    <div className="registationPage">
      <div className="registationCard">
        <h1 color="white" style={{ marginTop: "50px" }}>
          Регистрация
        </h1>
        <CurrentBlock onNext={handleNextStep} />
      </div>
    </div>
  );
};

const RegistrationEmail = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (email.trim() === "") {
      setEmailError("Поле почты обязательно для заполнения");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Пожалуйста, введите корректный адрес электронной почты");
      return;
    }
    onNext();
  };

  return (
    <div className="registrationBlock">
      <Label>Почта</Label>
      <TextBox
        type="text"
        placeholder="Введите адрес электронной почты"
        value={email}
        onChange={handleEmailChange}
        error={!!emailError}
      />
      {emailError && <ErrorText>{emailError}</ErrorText>}
      <Button onClick={handleNext}>Далее</Button>
      <label style={{ fontSize: "12px" }}>Зарегистрируйтесь через почту</label>
      <div className="socialMediaRegistration">
        <img
          arc="Зарегистрироваться через почту"
          src={emailPicture}
          alt="email"
        />
        <img arc="Зарегистрироваться через VK" src={vkPicture} alt="vk" />
      </div>
    </div>
  );
};

const RegistrationLoginPassword = ({ onNext }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNext = () => {
    let hasErrors = false;

    if (login.trim() === "" || password.trim() === "") {
      setLoginError("Поля логина и пароля обязательны для заполнения");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }
    onNext();
  };

  return (
    <div className="registrationBlock">
      <h2 className="registrationBlock__step">Шаг 2</h2>
      <hr />
      <Label>Логин</Label>
      <TextBox
        type="text"
        placeholder="Введите логин"
        value={login}
        onChange={handleLoginChange}
        error={!!loginError}
      />
      {loginError && <ErrorText>{loginError}</ErrorText>}
      <Label>Пароль</Label>
      <TextBox
        type="password"
        placeholder="Введите пароль"
        value={password}
        onChange={handlePasswordChange}
        error={!!passwordError}
      />
      {passwordError && <ErrorText>{passwordError}</ErrorText>}
      <Button onClick={handleNext}>Далее</Button>
    </div>
  );
};

const DateInput = styled.input`
  border-radius: 10px;
  border: 1.5px solid
    ${(props) => (props.error ? "rgb(255, 15, 111)" : "#4f0fff")};
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  width: 200px;
  padding: 2px 4px;
  ${(props) =>
    props.error &&
    `box-shadow: rgb(255, 15, 111) 0px 0px 10px;
  `}
`;

const RegistrationProfile = () => {
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
    setGeneralError("");
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
    setBirthdateError("");
    setGeneralError("");
  };

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    let hasErrors = false;
    setGeneralError("");

    if (username.trim() === "") {
      setUsernameError("Поле имени пользователя обязательно для заполнения");
      hasErrors = true;
    }

    if (birthdate.trim() === "") {
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDateObj.getFullYear();

    if (age < 14) {
      setBirthdateError("Вам должно быть не менее 14 лет для регистрации");
      return;
    }
    if (birthDateObj > currentDate) {
      setBirthdateError("Невозможная дата рождения");
      return;
    }
    setTimeout(() => {
      if (username === "existingUser") {
        setUsernameError("Это имя пользователя уже занято");
        return;
      }

      navigate(path);
    }, 500);
  };

  return (
    <div className="registrationBlock">
      <h2 className="registrationBlock__step">Шаг 3</h2>
      <hr />
      <div
        className="profilePhoto"
        style={{ position: "relative", display: "inline-block" }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <button className="profilePhoto__button--adding" htmlFor="file-input">
          +
        </button>
        {selectedImage && (
          <div>
            <img
              className="profilePhoto__image--adding"
              src={selectedImage}
              alt="Выбранное фото"
            />
          </div>
        )}
      </div>
      <Label>Имя пользователя</Label>
      <TextBox
        type="text"
        placeholder="Введите имя пользователя"
        value={username}
        onChange={handleUsernameChange}
        error={!!usernameError}
      />
      {usernameError && <ErrorText>{usernameError}</ErrorText>}
      <div className="dateOfBirth">
        <Label>Дата рождения</Label>
        <DateInput
          type="date"
          value={birthdate}
          onChange={handleBirthdateChange}
          error={!!birthdateError}
        />
      </div>
      <div className="verification">
        <input
          type="checkbox"
          onChange={(e) => setChecked(e.target.checked)}
          checked={checked}
        />
        <label>
          Вы подтверждаете, что согласны со всеми правилами данного сайта
        </label>
      </div>
      {generalError && (
        <ErrorText style={{ marginLeft: "32px" }}>{generalError}</ErrorText>
      )}
      <Button
        onClick={() => handleNavigation("/main")}
        disabled={!checked && !generalError}
      >
        Создать
      </Button>
    </div>
  );
};

export { RegistrationPage, ErrorText, TextBox, Label, Button };
export default RegistrationPage;
