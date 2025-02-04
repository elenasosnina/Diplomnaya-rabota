import React, { useState } from "react";
import "./Footer.css";
import icon1 from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon1.png";
import icon2 from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon2.png";
import icon3 from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon3.png";
import companyLogo from "C:/Users/user/diplomnaya-rabota/src/assets/sound-wave.png";
const Footer = () => {
  return (
    <div className="footer">
      <div className="icons">
        <img src={icon1} width={60}></img>
        <img src={icon2} width={60}></img>
        <img src={icon3} width={70}></img>
      </div>
      <div className="info">
        <p>+7-900-059-8609</p>
        <p>Почта: musicService@gmail.com</p>
        <p>г.Кострома, ул. Ленина, д.89</p>
      </div>
      <div className="logo-name">
        <img className="logo-img" src={companyLogo} alt="MyMusic. logo"></img>
        <h1 className="name" style={{ fontSize: 40 }}>
          impulse
        </h1>
      </div>
      <div className="rights">
        <p>Правила пользования платформой</p>
        <p>Политика конфиденциальности</p>
      </div>
    </div>
  );
};
export default Footer;
