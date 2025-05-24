import React, { useState } from "react";
import "./Footer.css";
import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";
import companyLogo from "../assets/sound-wave.png";
const icons = [icon1, icon2, icon3];
const Footer = () => {
  return (
    <footer className="footer">
      <div className="icons">
        {icons.map((icon, index) => (
          <img key={index} src={icon} width={index === 2 ? 70 : 60} />
        ))}
      </div>
      <div className="info">
        <p style={{ fontSize: "35px" }}>
          <b>+7-900-059-8609</b>
        </p>
        <p>Почта: musicService@gmail.com</p>
        <p>г.Кострома, ул. Ленина, д.89</p>
      </div>
      <div className="footer-logo-name">
        <img className="logo-img" src={companyLogo} alt="MyMusic. logo"></img>
        <h1 className="name" style={{ fontSize: 40 }}>
          impulse
        </h1>
      </div>
      <div className="info">
        <p>Правила пользования платформой</p>
        <p>Политика конфиденциальности</p>
      </div>
    </footer>
  );
};
export default Footer;
