import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/IntroductionPage";
import Login from "./pages/LoginPage";
import Registration from "./pages/RegistrationPage";
import MainPage from "./pages/MainPage";
import PlaylistPage from "./pages/PlaylistPage";
import Player from "./components/Player";
import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

const App = () => {
  const location = useLocation();
  const appStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor:
      location.pathname === "/login" || location.pathname === "/registration"
        ? "rgb(50, 0, 249)"
        : "rgb(255, 255, 255)",
  };
  const [currentSong, setCurrentSong] = useState(null); // Состояние для текущей песни
  const handleSongSelect = (song) => {
    setCurrentSong(song); // Обновляем текущее состояние песни
  };
  return (
    <div style={appStyle}>
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" && <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<MainPage />} />
        <Route
          path="/playlist"
          element={<PlaylistPage onSongSelect={handleSongSelect} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" && <Footer />}
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" &&
        location.pathname !== "/" && <Player currentSong={currentSong} />}
    </div>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
