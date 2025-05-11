import { React, useState } from "react";
import "./RecoveryPasswordPage.css";
import { ModalWindowInformation } from "../components/ModalWindows";
import { useNavigate } from "react-router-dom";

const RecoveryPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const steps = [
    {
      component: EnterUserData,
      props: { email, setEmail, userName, setUserName },
    },
    { component: ConfirmCode, props: { email } },
  ];

  const CurrentComponent = steps[currentStep].component;

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  return (
    <div className="page-recovery">
      <div className="card-recovery">
        <h1 style={{ fontSize: "36px" }}>Восстановление пароля</h1>
        <CurrentComponent
          onNext={handleNextStep}
          {...steps[currentStep].props}
        />
      </div>
    </div>
  );
};

const EnterUserData = ({ onNext, email, setEmail, userName, setUserName }) => {
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    if (userName && email) {
      onNext();
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  };

  return (
    <div className="card-recovery-component">
      <p style={{ fontSize: "12px" }}>
        Для восстановления пароля необходимо ввести данные аккаунта ниже
      </p>
      <label className="lables">Имя пользователя</label>
      <input
        className="card-textbox-input"
        type="text"
        placeholder="Введите имя пользователя"
        value={userName}
        onChange={handleUserNameChange}
      />
      <label className="lables">Электронная почта</label>
      <input
        className="card-textbox-input"
        type="email"
        placeholder="Введите электронную почту"
        value={email}
        onChange={handleEmailChange}
      />
      <button className="card-btn" onClick={handleSubmit}>
        Подтвердить
      </button>
    </div>
  );
};

const ConfirmCode = ({ email }) => {
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = () => {
    if (code === "11111") {
      setModalMessage(
        "Вы успешно вошли в аккаунт. Однако, для обеспечения безопасностиваших данных, вам следует сменить пароль в Настройках в разделе Безопасность"
      );
      setShowModal(true);
    } else {
      setModalMessage(
        "Войти в аккаунт не удалось. Проблема может заключаться в неправильно набранном Имени пользователя или не верно введеном коде проверки. Попробуйте еще раз!"
      );
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (
      modalMessage ===
      "Вы успешно вошли в аккаунт. Однако, для обеспечения безопасностиваших данных, вам следует сменить пароль в Настройках в разделе Безопасность"
    ) {
      navigate("/main");
    } else if (
      modalMessage ===
      "Войти в аккаунт не удалось. Проблема может заключаться в неправильно набранном Имени пользователя или не верно введеном коде проверки. Попробуйте еще раз!"
    ) {
      window.location.href = window.location.href;
    }
  };

  return (
    <div className="card-recovery-component">
      <p style={{ fontSize: "12px" }}>
        Проверьте ваш почтовый ящик и введите код подтверждения для входа в
        аккаунт
      </p>

      <label className="lables">Электронная почта</label>
      <input
        className="card-textbox-input"
        type="email"
        value={email}
        readOnly
      />
      <label className="lables">Код подтверждения</label>
      <input
        className="card-textbox-input"
        type="text"
        placeholder="Введите код подтверждения"
        value={code}
        onChange={handleCodeChange}
      />
      <button className="card-btn" onClick={handleSubmit}>
        Подтвердить
      </button>

      {showModal && (
        <ModalWindowInformation
          onClose={handleCloseModal}
          message={modalMessage}
          showCancelButton={false}
          confirmButtonText="Хорошо"
          onConfirm={handleCloseModal}
        />
      )}
    </div>
  );
};

export default RecoveryPasswordPage;
