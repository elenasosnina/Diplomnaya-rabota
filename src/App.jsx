import React, { useState, useEffect } from "react";
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
import SongsList from "./pages/SongsList";
import UserAccount from "./pages/UserAccountPage";
import AlbumList from "./pages/AlbumList";
import "./App.css";
import SingerPage from "./pages/SingerPage";
import ManageMusic from "./components/ManageMusic";
import AlbumSongs from "./pages/AlbumPage";
import vkPicture from "C:/Users/user/Desktop/Diplomnaya-rabota/src/assets/icon2.png";
import WebsiteInformationPage from "./pages/WebsiteInformationPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";
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

  const {
    currentSong,
    isPlaying,
    togglePlay,
    audioRef,
    handleSeek,
    currentTime,
    duration,
    handleLikeChange,
    playNextSong,
    playPreviousSong,
    songs,
    handleSongSelect,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    setSongs,
    toggleSongPlay,
  } = ManageMusic();

  const [users, setUsers] = useState([
    {
      id: 1,
      nickname: "hope",
      login: "admin",
      password: "12345",
      email: "ojafi@gmail.com",
      dateRegistration: "12.03.2024",
      photo: vkPicture,
    },
    {
      id: 2,
      nickname: "ole",
      login: "naruto",
      password: "54321",
      email: "uzu@gmail.com",
      dateRegistration: "02.05.2024",
      photo: vkPicture,
    },
  ]);
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };
  const [isMaximized, setIsMaximized] = useState(false); // Add state for maximized mode

  return (
    <div style={appStyle}>
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/websiteInfo" element={<WebsiteInformationPage />} />
        <Route
          path="/userAccount"
          element={
            <UserAccount
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
        <Route
          path="/singer"
          element={
            <SingerPage
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
        ></Route>
        <Route
          path="/album"
          element={
            <AlbumSongs
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
        <Route path="/albumList" element={<AlbumList />} />
        <Route path="/login" element={<Login users={users} />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/songsList"
          element={
            <SongsList
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              songs={songs}
              onSongSelect={handleSongSelect}
            />
          }
        />
      </Routes>
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" && <Footer />}
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" &&
        location.pathname !== "/" && (
          <Player
            key={currentSong ? currentSong.id : "no-song"}
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
            isShuffle={isShuffle}
            onToggleShuffle={toggleShuffle}
            isRepeat={isRepeat}
            onToggleRepeat={toggleRepeat}
            isMaximized={isMaximized}
            setIsMaximized={setIsMaximized}
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
