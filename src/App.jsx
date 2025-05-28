import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
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
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";
import RecoveryPasswordPage from "./pages/RecoveryPasswordPage";
import Media from "./components/Media";
import CoverImg from "./assets/bibi.jpg";
import GenresPage from "./pages/GenresPage";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      photo: CoverImg,
    },
    {
      id: 2,
      nickname: "ole",
      login: "naruto",
      password: "54321",
      email: "uzu@gmail.com",
      dateRegistration: "02.05.2024",
      photo: CoverImg,
    },
  ]);

  const [albums, setAlbums] = useState([
    {
      id: 1,
      title: "After Hours",
      artist: "The Weeknd",
      releaseDate: "20.03.2020",
      genre: "R&B",
      cover: CoverImg,
    },
    {
      id: 2,
      title: "Happier Than Ever",
      artist: "Billie Eilish",
      releaseDate: "30.07.2021",
      genre: "Pop",
      cover: CoverImg,
    },
    {
      id: 3,
      title: "Starboy",
      artist: "The Weeknd",
      releaseDate: "25.11.2016",
      genre: "R&B",
      cover: CoverImg,
    },
    {
      id: 4,
      title: "When We All Fall Asleep, Where Do We Go?",
      artist: "Billie Eilish",
      releaseDate: "29.03.2019",
      genre: "Pop",
      cover: CoverImg,
    },
  ]);

  const [artists, setArtists] = useState([
    {
      id: 1,
      nickname: "The Weeknd",
      genre: "R&B",
      albums: ["After Hours", "Starboy"],
      photo: CoverImg,
    },
    {
      id: 2,
      nickname: "Billie Eilish",
      genre: "Pop",
      albums: ["When We All Fall Asleep, Where Do We Go?", "Happier Than Ever"],
      photo: CoverImg,
    },
  ]);

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  const [isMaximized, setIsMaximized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: [],
    artists: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
    }
  }, [location.pathname]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (query) {
        const songResults = songs.filter((song) =>
          song.title?.toLowerCase().includes(query.toLowerCase())
        );
        const albumResults = albums.filter((album) =>
          album.title?.toLowerCase().includes(query.toLowerCase())
        );
        const artistResults = artists.filter((artist) =>
          artist.nickname?.toLowerCase().includes(query.toLowerCase())
        );

        const combinedResults = {
          songs: songResults,
          albums: albumResults,
          artists: artistResults,
        };

        setSearchResults(combinedResults);
      } else {
        setSearchResults({ songs: [], albums: [], artists: [] });
        setIsSearching(false);
        if (location.pathname === "/search") {
          navigate(-1);
        }
      }
    }, 1000);
  };

  const renderSearchResults = () => {
    if (isSearching) {
      if (
        searchResults.songs?.length > 0 ||
        searchResults.albums?.length > 0 ||
        searchResults.artists?.length > 0
      ) {
        return (
          <div className="search-results">
            {searchResults.songs?.length > 0 && (
              <>
                <h3>Треки</h3>
                <SongsList
                  songs={searchResults.songs}
                  isPlaying={isPlaying}
                  currentSong={currentSong}
                  currentTime={currentTime}
                  duration={duration}
                  toggleSongPlay={toggleSongPlay}
                  onLikeChange={handleLikeChange}
                  onSongSelect={handleSongSelect}
                />
              </>
            )}
            {searchResults.albums?.length > 0 && (
              <>
                <h3>Альбомы</h3>
                <div className="media-albums">
                  {searchResults.albums.map((album) => (
                    <Media
                      key={album.id}
                      item={album}
                      type="album"
                      onClick={() => {
                        navigate("/album", { state: { album } });
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            {searchResults.artists?.length > 0 && (
              <>
                <h3>Артисты</h3>
                <div className="media-artist">
                  {searchResults.artists.map((artist) => (
                    <Media
                      key={artist.id}
                      item={artist}
                      type="artist"
                      onClick={() => {
                        navigate("/singer", { state: { artist } });
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      } else {
        return (
          <div className="search-process">
            <p>
              Ничего с названием <b>{searchQuery}</b> не найдено{" "}
            </p>
          </div>
        );
      }
    } else {
      return (
        <div className="search-process">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={appStyle}>
      {location.pathname !== "/login" &&
        location.pathname !== "/recoveryPassword" &&
        location.pathname !== "/registration" && (
          <Header
            onSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        )}
      <ScrollToTop />
      <Routes>
        <Route path="/Diplomnaya-rabota/" element={<Main />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/recoveryPassword" element={<RecoveryPasswordPage />} />
        <Route
          path="/songs-genres"
          element={
            <GenresPage
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
        <Route path="/help" element={<HelpPage />} />
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
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
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
        <Route path="/search" element={renderSearchResults()} />
      </Routes>
      {location.pathname !== "/login" &&
        location.pathname !== "/recoveryPassword" &&
        location.pathname !== "/registration" && <Footer />}
      {location.pathname !== "/login" &&
        location.pathname !== "/recoveryPassword" &&
        location.pathname !== "/registration" &&
        location.pathname !== "/Diplomnaya-rabota/" && (
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
