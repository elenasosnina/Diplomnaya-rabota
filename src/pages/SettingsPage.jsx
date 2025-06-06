import React, { useState } from "react";
import "./SettingsPage.css";
import userCover from "../assets/bibi.jpg";
import userBack from "../assets/bibi_back.jpg";
import loginIcon from "../assets/login.png";
import passwordIcon from "../assets/password.png";
import UserBackgroundDefault from "../assets/UserBackgroundDefault.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ModalWindowInformation,
  ChangeLoginModal,
  ChangePasswordModal,
} from "../components/ModalWindows";

const SettingsPage = ({ setUser }) => {
  const [profilePicture, setProfilePicture] = useState(userCover);
  const [backgroundPicture, setBackgroundPicture] = useState(userBack);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [loginChangeInitiated, setLoginChangeInitiated] = useState(false);
  const [passwordChangeInitiated, setPasswordChangeInitiated] = useState(false);
  const [loginChangeSuccess, setLoginChangeSuccess] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const [email, setEmail] = useState(user.Email);
  const [username, setUsername] = useState(user.Nickname);
  const userdb = new Date(user.DateOfBirth);
  const [birthDate, setBirthDate] = useState(
    userdb.toISOString().split("T")[0]
  );

  const handleImageChange = (setter) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureChange = handleImageChange(setProfilePicture);
  const handleBackgroundPictureChange = handleImageChange(setBackgroundPicture);

  const handleImageClick = (inputId) => () => {
    document.getElementById(inputId).click();
  };

  const handleProfilePictureClick = handleImageClick("profile-picture-input");
  const handleBackgroundPictureClick = handleImageClick(
    "background-picture-input"
  );

  const handleOpenModal = (modalType) => {
    setCurrentModal(modalType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
    setLoginChangeInitiated(false);
    setPasswordChangeInitiated(false);
    setLoginChangeSuccess(false);
    setPasswordChangeSuccess(false);
  };

  const handleChangeFlow = (setter, infoModalType) => () => {
    setter(true);
    handleOpenModal(infoModalType);
  };

  const handleLoginChangeFlow = handleChangeFlow(
    setLoginChangeInitiated,
    "changeLogin",
    "loginInfo"
  );
  const handlePasswordChangeFlow = handleChangeFlow(
    setPasswordChangeInitiated,
    "changePassword",
    "passwordInfo"
  );

  const handleChangeSuccess = (setter, successModalType) => () => {
    setter(true);
    handleCloseModal();
    handleOpenModal(successModalType);
  };

  const handleLoginChangeSuccess = handleChangeSuccess(
    setLoginChangeSuccess,
    "loginSuccess"
  );
  const handlePasswordChangeSuccess = handleChangeSuccess(
    setPasswordChangeSuccess,
    "passwordSuccess"
  );

  const handleSaveChanges = () => {
    handleOpenModal("saveInfo");
  };
  const handleRefreshPage = () => {
    window.location.reload();
  };

  const deleteUser = async () => {
    try {
      const urlDeleteUser = `http://localhost:5000/api/user/settings/${user.UserID}`;
      const res = await fetch(urlDeleteUser, {
        method: "DELETE",
      });
      if (res.ok) {
        setUser(null);
        navigate("/main");
        handleCloseModal();
      } else {
        console.log("Ошибка" + res.status);
      }
    } catch (error) {
      console.error("Ошибка", error);
    }
  };

  const modalConfig = {
    saveInfo: {
      component: ModalWindowInformation,
      props: {
        message:
          "Ваш профиль обновлен. Изменения успешно зафиксированы и сохранены.",
        onConfirm: handleRefreshPage,
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
      },
    },
    loginInfo: {
      component: ModalWindowInformation,
      props: {
        message: "Смена логина затрагивает ваши данные. Будьте внимательны.",
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
        onConfirm: () => {
          handleOpenModal("changeLogin");
        },
      },
    },
    passwordInfo: {
      component: ModalWindowInformation,
      props: {
        message: "Смена пароля затрагивает ваши данные. Будьте внимательны.",
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
        onConfirm: () => {
          handleOpenModal("changePassword");
        },
      },
    },
    changeLogin: {
      component: ChangeLoginModal,
      props: {
        onSuccess: handleLoginChangeSuccess,
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
      },
    },
    changePassword: {
      component: ChangePasswordModal,
      props: {
        onSuccess: handlePasswordChangeSuccess,
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
      },
    },
    loginSuccess: {
      component: ModalWindowInformation,
      props: {
        message: "Вы успешно изменили логин",
        onConfirm: handleRefreshPage,
        showCancelButton: false,
        confirmButtonText: "Ок",
      },
    },
    passwordSuccess: {
      component: ModalWindowInformation,
      props: {
        message: "Вы успешно изменили пароль",
        onConfirm: handleRefreshPage,
        showCancelButton: false,
        confirmButtonText: "Ок",
      },
    },
    delInfo: {
      component: ModalWindowInformation,
      props: {
        message: "Если вы удалите аккаунт то все данные потеряются",
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
        onConfirm: deleteUser,
        onCancel: handleCloseModal,
      },
    },
  };

  const renderModal = () => {
    if (!isModalOpen || !currentModal) return null;

    const ModalComponent = modalConfig[currentModal].component;
    const modalProps = {
      ...modalConfig[currentModal].props,
      onClose: handleCloseModal,
    };

    return <ModalComponent {...modalProps} />;
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
                      src={user.PhotoProfile}
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
                      src={user.PhotoBackground || UserBackgroundDefault}
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label>Имя пользователя</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Дата рождения</label>
                  <input
                    type="date"
                    className="form-control"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSaveChanges}
                >
                  Сохранить изменения
                </button>
              </div>
              <hr />

              <div className="del-account">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleOpenModal("delInfo")}
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
                  onClick={handleLoginChangeFlow}
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
                  onClick={handlePasswordChangeFlow}
                >
                  Изменить
                </button>
              </div>
            </form>
          </div>
        </div>

        {isModalOpen && renderModal()}
      </div>
    </div>
  );
};

export default SettingsPage;
