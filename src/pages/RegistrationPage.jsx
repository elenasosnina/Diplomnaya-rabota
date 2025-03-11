import React, { useState } from "react";
import "./RegistrationPage.css";
import { useNavigate } from "react-router-dom";
import emailPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/email.png";
import vkPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon2.png";
import styled from "styled-components";
import Main from "./MainPage";

const Button = styled.button`
  margin: 0 16px 24px 16px;
  height: 60px;
  color: #ffffff;
  background-color: #4f0fff;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;
const TextBox = styled.input`
  margin: 10px 16px 24px 16px;
  border-radius: 10px;
  border: none;
  padding: 16px;
  background-color: rgb(164, 164, 164);
  color: #ffffff;
  font-size: 16px;
`;
const Label = styled.label`
  font-size: 14px;
  display: flex;
  justify-self: left;
  margin-left: 32px;
`;
const NumberStep = ({ children }) => {
  return <h2 className="step">{children}</h2>;
};
const ProgressBar = () => {
  return <div className="progressbar"></div>;
};
const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { component: RegistrationEmail },
    { component: RegistrationLoginPassword },
    { component: RegistrationProfile },
  ];
  const CurrentComponent = steps[currentStep].component;
  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };
  return (
    <div className="page-sign-up">
      <div className="card-sign-up">
        <h1 className="heading" color="white" style={{ marginTop: "50px" }}>
          Регистрация
        </h1>
        <CurrentComponent onNext={handleNextStep} />
      </div>
    </div>
  );
};
const RegistrationEmail = ({ onNext }) => {
  return (
    <div className="registration">
      <Label>Почта</Label>
      <TextBox type="text" placeholder="Введите адрес электронной почты" />
      <Button onClick={onNext}>Войти</Button>
      <label style={{ fontSize: "12px" }}>Зарегистрируйтесь через почту</label>
      <div className="sign-up-with">
        <img arc="Войти через почту" src={emailPicture} />
        <img arc="Войти через VK" src={vkPicture} />
      </div>
    </div>
  );
};
const RegistrationLoginPassword = ({ onNext }) => {
  return (
    <div className="registration">
      <NumberStep>Шаг 2</NumberStep>
      <ProgressBar />
      <Label>Логин</Label>
      <TextBox type="text" placeholder="Введите логин" />
      <Label>Пароль</Label>
      <TextBox type="password" placeholder="Введите пароль" />
      <Button onClick={onNext}>Продолжить</Button>
    </div>
  );
};
const RegistrationProfile = () => {
  const [selectedImage, setSelectedImage] = useState("src/assets/profile.webp");

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
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="registration">
      <NumberStep>Шаг 3</NumberStep>
      <ProgressBar />
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label className="add-photo" htmlFor="file-input">
          +
        </label>
        {selectedImage && (
          <div>
            <img
              className="photo-profile"
              src={selectedImage}
              alt="Выбранное"
            />
          </div>
        )}
      </div>
      <Label>Имя пользователя</Label>
      <TextBox type="text" placeholder="Введите имя пользователя" />
      <div className="bd">
        <Label>Дата рождения</Label>
        <input className="birthday" type="date" style={{ width: "200px" }} />
      </div>
      <div className="verification">
        <input type="checkbox" />
        <label>
          Вы подтверждаете, что согласны со всеми правилами данного сайта
        </label>
      </div>
      <Button onClick={() => handleNavigation("/main")}>Продолжить</Button>
    </div>
  );
};
export default RegistrationPage;
