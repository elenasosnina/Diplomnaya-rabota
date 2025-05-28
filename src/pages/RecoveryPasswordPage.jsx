import { React, useState } from "react";
import "./RecoveryPasswordPage.css";
import { ModalWindowInformation } from "../components/ModalWindows";
import { useNavigate } from "react-router-dom";
import * as RegistrationComponents from "./RegistrationPage.jsx";

const { ErrorText, TextBox, Label, Button } = RegistrationComponents;

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
    <div className="recoveryPage">
      <div className="recoveryCard">
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
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setError("");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
    setError("");
  };

  const handleSubmit = () => {
    setEmailError("");
    setError("");
    if (email.trim() === "" || userName.trim() === "") {
      setError("Поля ввода обязательны для заполнения");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Пожалуйста, введите корректный адрес электронной почты");
      return;
    }
    onNext();
  };

  return (
    <div className="recoveryComponent">
      <p style={{ fontSize: "12px" }}>
        Для восстановления пароля необходимо ввести данные аккаунта ниже
      </p>

      {error && <ErrorText>{error}</ErrorText>}

      <Label>Имя пользователя</Label>
      <TextBox
        type="text"
        placeholder="Введите имя пользователя"
        value={userName}
        onChange={handleUserNameChange}
        error={!!error}
      />

      <Label className="lables">Электронная почта</Label>
      <TextBox
        type="email"
        placeholder="Введите электронную почту"
        value={email}
        onChange={handleEmailChange}
        error={!!emailError || !!error}
      />

      {emailError && <ErrorText>{emailError}</ErrorText>}

      <Button onClick={handleSubmit}>Подтвердить</Button>
    </div>
  );
};

const ConfirmCode = ({ email }) => {
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleCodeChange = (event) => {
    setCode(event.target.value);
    setError("");
  };

  const handleSubmit = () => {
    if (code.trim() === "") {
      setError("Поле кода подтверждения обязательно для заполнения");
      return;
    }
    if (code === "11111") {
      setModalMessage(
        "Вы успешно вошли в аккаунт. Однако, для обеспечения безопасности ваших данных, вам следует сменить пароль в Настройках в разделе Безопасность"
      );
      setShowModal(true);
    } else {
      setModalMessage(
        "Войти в аккаунт не удалось. Проблема может заключаться в неправильно набранном Имени пользователя или неверно введенном коде проверки. Попробуйте еще раз!"
      );
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalMessage.includes("Вы успешно вошли в аккаунт")) {
      navigate("/main");
    }
  };

  return (
    <div className="recoveryComponent">
      <p style={{ fontSize: "12px" }}>
        Проверьте ваш почтовый ящик и введите код подтверждения для входа в
        аккаунт
      </p>

      <Label>Электронная почта</Label>
      <TextBox
        type="email"
        value={email}
        readOnly
        style={{ backgroundColor: "rgba(199, 199, 204, 0.64)" }}
      />

      <Label>Код подтверждения</Label>
      <TextBox
        type="text"
        placeholder="Введите код подтверждения"
        value={code}
        onChange={handleCodeChange}
        error={!!error}
      />

      {error && <ErrorText>{error}</ErrorText>}

      <Button onClick={handleSubmit}>Подтвердить</Button>

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
