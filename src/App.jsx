// App.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
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
import SingerPage from "./pages/SingerPage"; // Import SingerPage

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
  const [shuffledSongs, setShuffledSongs] = useState([]); // Separate shuffled song list
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = useCallback((array) => {
    const newArray = [...array]; // Create a copy to avoid modifying the original
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prevIsShuffle) => {
      const newShuffleState = !prevIsShuffle;

      if (newShuffleState) {
        // If shuffle is turned on, shuffle the songs and store in shuffledSongs
        setShuffledSongs(shuffleArray(songs));
      } else {
        // If shuffle is turned off, clear shuffledSongs. The logic in playNextSong
        // will then use the original 'songs' array.
        setShuffledSongs([]);
      }
      return newShuffleState;
    });
  }, [songs, shuffleArray]);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prevIsRepeat) => !prevIsRepeat);
  }, []);

  const handleLikeChange = useCallback((songId, newLiked) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId ? { ...song, liked: newLiked } : song
      )
    );

    setShuffledSongs((prevShuffledSongs) =>
      prevShuffledSongs.map((song) =>
        song.id === songId ? { ...song, liked: newLiked } : song
      )
    );
  }, []);

  const handleSongSelect = useCallback((song) => {
    setCurrentSong(song);
    audioRef.current.src = song.audio;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error("Ошибка воспроизведения:", error));
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleSongPlay = useCallback(
    (song) => {
      if (currentSong && currentSong.id === song.id) {
        togglePlay();
      } else {
        handleSongSelect(song);
      }
    },
    [currentSong, handleSongSelect, togglePlay]
  );

  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const playNextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;

    const songListToUse = isShuffle ? shuffledSongs : songs;

    let currentIndex = songListToUse.findIndex(
      (song) => song.id === currentSong.id
    );

    // Handle case where the current song is not found in the list
    if (currentIndex === -1) {
      currentIndex = 0; // Start from the beginning
    }

    let nextIndex = (currentIndex + 1) % songListToUse.length;
    handleSongSelect(songListToUse[nextIndex]);
  }, [currentSong, songs, shuffledSongs, isShuffle, handleSongSelect]);

  const playPreviousSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;

    const songListToUse = isShuffle ? shuffledSongs : songs;

    let currentIndex = songListToUse.findIndex(
      (song) => song.id === currentSong.id
    );

    // Handle case where the current song is not found in the list
    if (currentIndex === -1) {
      currentIndex = 0; // Start from the beginning
    }
    let previousIndex =
      (currentIndex - 1 + songListToUse.length) % songListToUse.length;
    handleSongSelect(songListToUse[previousIndex]);
  }, [currentSong, songs, shuffledSongs, isShuffle, handleSongSelect]);

  // Effect for updating duration and current time
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

  // Auto play next song when song ends
  useEffect(() => {
    const handleEnded = () => {
      if (isRepeat) {
        // If repeat is on, play the same song again
        audioRef.current
          .play()
          .catch((error) => console.error("Ошибка воспроизведения:", error)); // Replay current song
      } else {
        // Otherwise, play the next song
        playNextSong();
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [playNextSong, isRepeat]);

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
            songs={songs} // Pass the songs array to the Player component
            onSongSelect={handleSongSelect}
            isShuffle={isShuffle}
            onToggleShuffle={toggleShuffle}
            isRepeat={isRepeat}
            onToggleRepeat={toggleRepeat}
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
