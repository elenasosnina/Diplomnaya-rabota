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
  const audioRef = useRef(new Audio());
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    //отслеживание проигрывания песни
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    // const handleEnded = () => {
    //   setCurrentTime(0); // Сброс текущего времени по завершении
    //   setIsPlaying(false); // Остановить воспроизведение
    // };
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
  const handleLikeChange = (songId, newLiked) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId ? { ...song, liked: newLiked } : song
      )
    );
  };
  //отвечает за play/pause
  const toggleSongPlay = (song) => {
    // выбор и переключение воспроизведения
    //ф-я при нажатии play/pause
    if (currentSong && currentSong.id === song.id) {
      //если это та же песня
      togglePlay();
    } else {
      // другая песня
      handleSongSelect(song);
    }
  };
  const togglePlay = () => {
    // ф-я остановки и возобновления песни
    if (isPlaying) {
      //если песня играет
      audioRef.current.pause(); //то ставим на паузу
    } else {
      audioRef.current // возобновляем проигрывание
        .play()
        .then(() => {}) //если успешно, то что-то(в этом случае ничего) должно произойти
        .catch((error) => console.error("Ошибка воспроизведения:", error)); //если возникнет ошибка
    }
    setIsPlaying(!isPlaying); // переключаем на противоположное состояние
  };
  const handleSongSelect = (song) => {
    // выбор песни
    setCurrentSong(song); // Устанавливаем выбранную песню как текущую
    audioRef.current.src = song.audio; // Устанавливаем источник аудио на URL выбранной песни
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error("Ошибка воспроизведения:", error));
  };

  // перемотка
  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
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
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
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
            onLikeChange={handleLikeChange}
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
