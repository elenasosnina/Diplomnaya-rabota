import React, { useEffect, useState } from "react";
import "./HelpPage.css";

const HelpPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    {
      label: "Как слушать музыку?",
      description:
        "Чтобы слушать музыку, просто нажмите кнопку воспроизведения на вашем устройстве. Вы можете выбрать трек из вашей библиотеки или потокового сервиса. Убедитесь, что ваше устройство подключено к интернету, если вы используете онлайн-сервис.",
    },
  ];

  const steps = [
    { component: HelpPageContent },
    { component: TechSupport },
    { component: FAQ },
    { component: AnswersQuestions },
  ];

  let CurrentComponent;

  if (currentStep === 3 && selectedQuestion) {
    CurrentComponent = steps[currentStep].component;
  } else {
    CurrentComponent = steps[currentStep].component;
  }

  return (
    <div className="help-page">
      <CurrentComponent
        setCurrentStep={setCurrentStep}
        questions={questions}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
      />
    </div>
  );
};

const HelpPageContent = ({ setCurrentStep }) => {
  return (
    <div className="help-page-content">
      <h1>Помощь</h1>
      <div className="help-content-list">
        <ul className="list-group list-group-flush">
          <li
            className="list-group-item"
            onClick={() => {
              setCurrentStep(2);
            }}
            style={{ cursor: "pointer" }}
          >
            Часто задаваемые вопросы
          </li>
          <li
            className="list-group-item"
            onClick={() => {
              setCurrentStep(1);
            }}
            style={{ cursor: "pointer" }}
          >
            Техническая поддержка
          </li>
        </ul>
      </div>
    </div>
  );
};

const TechSupport = ({ setCurrentStep }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [text, setText] = useState("");
  const [message, setMessage] = useState([]);
  const clearText = () => {
    setText("");
  };
  const handleChange = (event) => {
    setText(event.target.value);
  };

  const postMessage = async (user, text) => {
    const urlSendMessage = "http://localhost:5000/api/technialSupport";
    console.log(user.Nickname);
    console.log(user.Email);
    const data = {
      nickname: user.Nickname,
      email: user.Email,
      text: text,
    };

    try {
      const result = await fetch(urlSendMessage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await result.json();

      if (!result.ok) {
        console.error("Ошибка:", res.error || res.message);
        setMessage(res.message);
      } else {
        console.log("Успешно отправлено:", res);
        setMessage("Сообщение успешно доставнено");
        clearText();
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };
  const handleSubmit = () => {
    postMessage(user, text);
  };

  return (
    <div className="help-page-content">
      <p
        onClick={() => {
          setCurrentStep(0);
        }}
        style={{ cursor: "pointer" }}
      >
        Помощь
      </p>
      <h1>Техническая поддержка</h1>
      <p className="explain-p">
        Заметили неисправность? Сообщите нам при помощи инструмента технической
        поддержки. Вы можете сделать нас лучше.
      </p>
      {message ? <p style={{ color: "white" }}>{String(message)}</p> : null}
      <div className="help-message">
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          onChange={handleChange}
          value={text}
        ></textarea>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="help-page-btn"
            onClick={handleSubmit}
            disabled={!text}
          >
            Отправить
          </button>
          <button className="help-page-btn" onClick={clearText}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

const FAQ = ({ setCurrentStep, setSelectedQuestion }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [FAQ, setFAQ] = useState([]);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const urlFAQ = "http://localhost:5000/api/help/FAQ";
  const getDataFAQ = async () => {
    try {
      const res = await fetch(urlFAQ);
      if (res.ok) {
        let json = await res.json();
        setFAQ(json);
      } else {
        console.log("Ошибка" + res.status);
      }
    } catch (error) {
      console.error("Ошибка", error);
    }
  };
  useEffect(() => {
    getDataFAQ();
  }, []);
  const filteredQuestions = FAQ.filter((question) =>
    question.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="help-page-content">
      <p
        onClick={() => {
          setCurrentStep(0);
        }}
        style={{ cursor: "pointer" }}
      >
        Помощь
      </p>
      <h1>Часто задаваемые вопросы</h1>
      <div className="help-page-form">
        <input
          type="search"
          className="form-control"
          placeholder="Найти..."
          onChange={handleSearch}
        />
      </div>

      <div className="FAQ-content-list">
        <ul className="list-group list-group-flush">
          {filteredQuestions.map((question) => (
            <li
              className="list-group-item"
              key={question.Title}
              onClick={() => {
                setSelectedQuestion(question);
                setCurrentStep(3);
              }}
              style={{ cursor: "pointer" }}
            >
              {question.Title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AnswersQuestions = ({ setCurrentStep, selectedQuestion }) => {
  return (
    <div className="help-page-content">
      <p
        onClick={() => {
          setCurrentStep(2);
        }}
        style={{ cursor: "pointer" }}
      >
        Часто задаваемые вопросы
      </p>
      <h1>{selectedQuestion.Title}</h1>

      <div className="full-answer-questions">
        {selectedQuestion.Description}
      </div>
    </div>
  );
};

export default HelpPage;
