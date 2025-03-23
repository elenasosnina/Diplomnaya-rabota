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
  const [songs, setSongs] = useState([]);

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

  const handleLikeChange = (songId, newLiked) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId ? { ...song, liked: newLiked } : song
      )
    );
  };

  const toggleSongPlay = (song) => {
    if (currentSong && currentSong.id === song.id) {
      togglePlay();
    } else {
      handleSongSelect(song);
    }
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

  const handleSongSelect = (song) => {
    setCurrentSong(song);
    audioRef.current.src = song.audio;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error("Ошибка воспроизведения:", error));
  };

  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const playNextSong = () => {
    if (!currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    handleSongSelect(songs[nextIndex]);
  };
  const playPreviousSong = () => {
    if (!currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    handleSongSelect(songs[previousIndex]);
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
              audioRef={audioRef}
              setSongs={setSongs}
              songs={songs}
              onSongSelect={handleSongSelect}
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
            playNextSong={playNextSong}
            playPreviousSong={playPreviousSong}
            songs={songs}
            onSongSelect={handleSongSelect}
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
