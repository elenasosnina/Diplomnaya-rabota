import React, { useState, useEffect } from "react";
import "./SettingsPage.css";
import loginIcon from "../assets/login.png";
import passwordIcon from "../assets/password.png";
import UserBackgroundDefault from "../assets/UserBackgroundDefault.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ModalWindowInformation,
  ChangeLoginModal,
  ChangePasswordModal,
} from "../components/ModalWindows";

const SettingsPage = ({ userData }) => {
  const [profileFile, setProfileFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [loginChangeInitiated, setLoginChangeInitiated] = useState(false);
  const [passwordChangeInitiated, setPasswordChangeInitiated] = useState(false);
  const [loginChangeSuccess, setLoginChangeSuccess] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    return userData || JSON.parse(localStorage.getItem("user"));
  });
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [backgroundPicture, setBackgroundPicture] = useState(
    UserBackgroundDefault
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.Email || "");
      setUsername(user.Nickname || "");
      const userdb = new Date(user.DateOfBirth);
      setBirthDate(userdb.toISOString().split("T")[0] || "");
      setProfilePicture(user.PhotoProfile || "");

      if (user.PhotoBackground) {
        setBackgroundPicture(user.PhotoBackground);
      } else {
        setBackgroundPicture(UserBackgroundDefault);
      }
    }
  }, [user]);

  const handleImageChange = (type) => (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setProfilePicture(reader.result);
        setProfileFile(file);
      } else {
        setBackgroundPicture(reader.result);
        setBackgroundFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfilePictureChange = handleImageChange("profile");
  const handleBackgroundPictureChange = handleImageChange("background");

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
    "loginInfo",
    "changeLogin",
    "loginSuccess"
  );
  const handlePasswordChangeFlow = handleChangeFlow(
    setPasswordChangeInitiated,
    "passwordInfo",
    "changePassword",
    "passwordSuccess"
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
  const today = new Date();
  const birthDateObj = birthDate ? new Date(birthDate) : null;

  const isInvalidBirthDate =
    !birthDateObj ||
    birthDateObj >= today ||
    (birthDateObj && today.getFullYear() - birthDateObj.getFullYear() < 15) ||
    (birthDateObj &&
      birthDateObj <
        new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()));

  const deleteUser = async () => {
    try {
      const urlDeleteUser = `http://localhost:5000/api/user/settings/${user.UserID}`;
      const res = await fetch(urlDeleteUser, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Не удалось удалить пользователя");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/main");
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка:", error.message);
      alert(error.message);
    }
  };
  const updateData = async (
    id,
    email,
    username,
    birthDate,
    profileFile,
    backgroundFile
  ) => {
    const url = `http://localhost:5000/api/settings/${id}`;

    try {
      const formData = new FormData();
      formData.append("Email", email);
      formData.append("Nickname", username);
      formData.append("DateOfBirth", birthDate);
      if (profileFile) {
        formData.append("profileFile", profileFile);
      }
      if (backgroundFile) {
        formData.append("backgroundFile", backgroundFile);
      }
      const res = await fetch(url, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Ошибка:", data.error || data.message);
        setMessage(data.error || data.message);
      } else {
        handleOpenModal("saveInfo");
        setMessage("");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage("Произошла ошибка при обновлении данных.");
    }
  };
  const handleSaveChanges = () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    };
    if (!isValidEmail(email)) {
      setMessage("Пожалуйста, введите корректный адрес электронной почты");
      return;
    } else {
      setMessage("");
      updateData(
        user.UserID,
        email,
        username,
        birthDate,
        profileFile,
        backgroundFile
      );
    }
  };
  const handleRefreshPage = () => {
    window.location.reload();
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
        user: user,
      },
    },
    changePassword: {
      component: ChangePasswordModal,
      props: {
        onSuccess: handlePasswordChangeSuccess,
        showCancelButton: true,
        confirmButtonText: "Подтвердить",
        user: user,
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
        onConfirm: () => {
          deleteUser();
        },
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
                href="#profile"
              >
                Профиль
              </a>
              <a
                className="list-group-item list-group-item-action"
                href="#security"
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
                <h1 id="profile">Редактирование профиля</h1>
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
                  {message && <p className="error-message">{message}</p>}
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
                    maxLength={15}
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
                  disabled={
                    !email || !username || !birthDate || isInvalidBirthDate
                  }
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

              <h1 id="security">Безопасность</h1>
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
