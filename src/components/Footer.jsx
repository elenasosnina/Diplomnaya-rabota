import React, { useState } from "react";
import "./Footer.css";
import companyLogo from "../assets/sound-wave.png";
import icon1 from "../assets/icon1.png";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="icons">
        <img src={icon1} width="70" href={"https://t.me/impulseOfficialSite"} />
      </div>
      <div className="info">
        <p style={{ fontSize: "35px" }}>
          <b>+7-900-059-8609</b>
        </p>
        <p>Почта: musicService@gmail.com</p>
        <p>г.Кострома, ул. Ленина, д.89</p>
      </div>
      <div className="footer-logo-name">
        <img
          className="logoName__image"
          src={companyLogo}
          alt="MyMusic. logo"
        ></img>
        <h1 className="logoName__heading" style={{ fontSize: 40 }}>
          impulse
        </h1>
      </div>
      <div className="info">
        <a href="https://disk.yandex.ru/i/4f7EUQ9Q1nudNw">
          Правила пользования платформой
        </a>
        <br />
        <br />
        <a href="https://disk.yandex.ru/i/OVXL1FlVMwdoIw">
          Политика конфиденциальности
        </a>
      </div>
    </footer>
  );
};
export default Footer;
