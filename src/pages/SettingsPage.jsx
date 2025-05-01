import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import userCover from "../assets/bibi.jpg";
import userBack from "../assets/bibi_back.jpg";
import loginIcon from "../assets/login.png";
import passwordIcon from "../assets/password.png";
import {
  ShareModalWindow,
  CreditsModalWindow,
  AddToPlaylistModalWindow,
  ModalWindowInformation,
} from "../components/ModalWindows";

const SettingsPage = () => {
  const [profilePicture, setProfilePicture] = useState(userCover);
  const [backgroundPicture, setBackgroundPicture] = useState(userBack);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const navigate = useNavigate();

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundPictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    document.getElementById("profile-picture-input").click();
  };

  const handleBackgroundPictureClick = () => {
    document.getElementById("background-picture-input").click();
  };

  const handleOpenModal = (modalType) => {
    console.log(`Открытие модального окна: ${modalType}`);
    setCurrentModal(modalType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleBirthDateChange = (event) => {
    setBirthDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Данные для отправки:", {
      profilePicture,
      backgroundPicture,
      email,
      username,
      birthDate,
    });
  };

  const song = {
    artist: "Artist Name",
    producer: "Producer Name",
    authorLyrics: "Lyrics Author",
    composer: "Composer Name",
    rights: "Rights Holder",
    url: "https://example.com/song-url", // Added song URL
  };

  return (
    <div className="settings-page">
      <div className="settings-page-content">
        <div className="settings-content-wrapper">
          <div className="settings-nav">
            <div id="list-example" className="list-group">
              <a
                className="list-group-item list-group-item-action"
                href="#list-item-1"
              >
                Профиль
              </a>
              <a
                className="list-group-item list-group-item-action"
                href="#list-item-2"
              >
                Безопасность
              </a>
            </div>
          </div>
          <div
            data-bs-spy="scroll"
            data-bs-target="#list-example"
            data-bs-offset="0"
            className="scrollspy-example"
            tabIndex="0"
          >
            <form className="settings-page-form" onSubmit={handleSubmit}>
              <div className="edit-images">
                <h1 id="list-item-1">Редактирование профиля</h1>
                <div>
                  <label>Фото профиля</label>
                  <div className="image-upload-wrapper">
                    <img
                      className="set-profile-photo"
                      src={profilePicture}
                      alt="Profile"
                      onClick={handleProfilePictureClick}
                    />
                    <input
                      type="file"
                      id="profile-picture-input"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <hr />
                <div>
                  <label>Фон профиля</label>
                  <div className="image-upload-wrapper">
                    <img
                      className="set-background-photo"
                      src={backgroundPicture}
                      alt="Background"
                      onClick={handleBackgroundPictureClick}
                    />
                    <input
                      type="file"
                      id="background-picture-input"
                      accept="image/*"
                      onChange={handleBackgroundPictureChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>

              <hr />
              <div className="settings-form">
                <div>
                  <label>Почта</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label>Имя пользователя</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="form-group">
                  <label>Дата рождения</label>
                  <input
                    type="date"
                    className="form-control"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                  />
                </div>
              </div>
              <hr />
              <div className="del-account">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleOpenModal("information")}
                >
                  Удалить аккаунт
                </button>
                <p>
                  Будьте аккуратны! При нажатии на кнопку ваши данные будут
                  удалены и восстановить их будет нельзя
                </p>
              </div>
              <hr />
              <h1 id="list-item-2">Безопасность</h1>

              <div className="secure-form">
                <div>
                  <img src={loginIcon} alt="Login Icon" />
                  <div>
                    <label>Логин</label>
                    <p>Ваш логин</p>
                  </div>
                </div>
                <button className="btn btn-primary" type="button">
                  Изменить
                </button>
              </div>
              <div className="secure-form">
                <div>
                  <img src={passwordIcon} alt="Password Icon" />
                  <div>
                    <label>Пароль</label>
                    <p>Редактировать пароль</p>
                  </div>
                </div>
                <button className="btn btn-primary" type="button">
                  Изменить
                </button>
              </div>

              <button className="btn btn-primary" type="submit">
                Сохранить изменения
              </button>
            </form>
          </div>
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            {currentModal === "information" && (
              <ModalWindowInformation onClose={handleCloseModal} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
