import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/IntroductionPage";
import Login from "./pages/LoginPage";
import Registration from "./pages/RegistrationPage";
import MainPage from "./pages/MainPage";
import PlaylistPage from "./pages/PlaylistPage";
import Player from "./components/Player";
import "./App.css";

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

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songPositions, setSongPositions] = useState({}); // { songId: position }
  const audioRef = useRef(new Audio()); // Создаем один экземпляр Audio
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    if (currentSong) {
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [currentSong]);

  const handleSongSelect = (song) => {
    // Сохраняем текущую позицию предыдущей песни
    if (currentSong) {
      setSongPositions({
        ...songPositions,
        [currentSong.id]: audioRef.current.currentTime,
      });
    }

    setCurrentSong(song);
    audioRef.current.src = song.audio;

    // Восстанавливаем позицию, если она была сохранена
    if (song.id in songPositions) {
      audioRef.current.currentTime = songPositions[song.id];
    } else {
      audioRef.current.currentTime = 0; // Начинаем с начала
    }

    audioRef.current.load();

    // Устанавливаем обработчик события oncanplaythrough
    audioRef.current.oncanplaythrough = () => {
      // Начинаем воспроизведение, только когда аудио готово
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    };
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => {})
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); // Update current time state
  };

  // Добавляем функцию для переключения воспроизведения конкретной песни
  const toggleSongPlay = (song) => {
    if (currentSong && currentSong.id === song.id) {
      // Если это текущая песня, просто переключаем воспроизведение
      togglePlay();
    } else {
      // Если это другая песня, выбираем ее и начинаем воспроизведение
      handleSongSelect(song);
    }
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
          element={
            <PlaylistPage
              onSongSelect={handleSongSelect}
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              audioRef={audioRef}
              toggleSongPlay={toggleSongPlay} // Передаем функцию в PlaylistPage
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" && <Footer />}
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" &&
        location.pathname !== "/" && (
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            audioRef={audioRef}
            onSeek={handleSeek}
            currentTime={currentTime}
            duration={duration}
          />
        )}
    </div>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
