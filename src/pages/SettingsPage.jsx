import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import userCover from "../assets/bibi.jpg";
import userBack from "../assets/bibi_back.jpg";
import loginIcon from "../assets/login.png";
import passwordIcon from "../assets/password.png";
import {
  ModalWindowInformation,
  ChangeLoginModal,
  ChangePasswordModal,
} from "../components/ModalWindows";

const SettingsPage = () => {
  const [profilePicture, setProfilePicture] = useState(userCover);
  const [backgroundPicture, setBackgroundPicture] = useState(userBack);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
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
    setCurrentModal(modalType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
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
            <form className="settings-page-form">
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
                  />
                </div>
                <div>
                  <label>Имя пользователя</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group">
                  <label>Дата рождения</label>
                  <input type="date" className="form-control" />
                </div>
              </div>
              <hr />

              <div className="del-account">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleOpenModal("information")} // Corrected line
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
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleOpenModal("changeLogin")}
                >
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
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleOpenModal("changePassword")}
                >
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
            {currentModal === "changeLogin" && (
              <ChangeLoginModal onClose={handleCloseModal} />
            )}
            {currentModal === "changePassword" && (
              <ChangePasswordModal onClose={handleCloseModal} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
