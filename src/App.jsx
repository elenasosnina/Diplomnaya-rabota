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
import GenresPage from "./pages/GenresPage";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const appStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor:
      location.pathname === "/login" ||
      location.pathname === "/registration" ||
      location.pathname === "/recoveryPassword"
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
    songs: allSongs,
    handleSongSelect,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    setSongs: setAllSongs,
    toggleSongPlay,
  } = ManageMusic();

  const [isMaximized, setIsMaximized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchResultsSongs, setSearchResultsSongs] = useState([]);
  const [searchResultsAlbums, setSearchResultsAlbums] = useState([]);
  const [searchResultsArtists, setSearchResultsArtists] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  const Songsurl = "http://localhost:5000/api/songs";
  const getSongsData = async () => {
    try {
      const res = await fetch(Songsurl);
      if (res.ok) {
        let json = await res.json();
        setAllSongs(json); // Setting All songs
      } else {
        console.log("Ошибка HTTP: " + res.status);
      }
    } catch (error) {
      console.error("Ошибка при загрузке песен: ", error);
    }
  };

  const urlAlbums = "http://localhost:5000/api/albums";
  const getDataAlbums = async () => {
    try {
      const res = await fetch(urlAlbums);
      if (res.ok) {
        let json = await res.json();
        setAlbums(json);
      } else {
        console.log("Ошибка HTTP: " + res.status);
      }
    } catch (error) {
      console.error("Ошибка при загрузке альбомов: ", error);
    }
  };

  const urlPlaylists = "http://localhost:5000/api/playlists";
  const getDataPlaylists = async () => {
    try {
      const res = await fetch(urlPlaylists);
      if (res.ok) {
        let json = await res.json();
        setPlaylists(json);
      } else {
        console.log("Ошибка HTTP: " + res.status);
      }
    } catch (error) {
      console.error("Ошибка при загрузке плейлистов: ", error);
    }
  };

  const urlArtists = "http://localhost:5000/api/artists";
  const getDataArtists = async () => {
    try {
      const res = await fetch(urlArtists);
      if (res.ok) {
        let json = await res.json();
        setArtists(json);
      } else {
        console.log("Ошибка HTTP: " + res.status);
      }
    } catch (error) {
      console.error("Ошибка при загрузке артистов: ", error);
    }
  };

  useEffect(() => {
    getSongsData();
    getDataAlbums();
    getDataPlaylists();
    getDataArtists();
  }, []);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
      setIsSearching(false);
      setSearchResultsSongs([]);
      setSearchResultsAlbums([]);
      setSearchResultsArtists([]);
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
        const songResults = allSongs.filter((song) =>
          song.Title?.toLowerCase().includes(query.toLowerCase())
        );
        const albumResults = albums.filter((album) =>
          album.Title?.toLowerCase().includes(query.toLowerCase())
        );
        const artistResults = artists.filter((artist) =>
          artist.Nickname?.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResultsSongs(songResults);
        setSearchResultsAlbums(albumResults);
        setSearchResultsArtists(artistResults);
      } else {
        setIsSearching(false);
        setSearchResultsSongs([]);
        setSearchResultsAlbums([]);
        setSearchResultsArtists([]);
        if (location.pathname === "/search") {
          navigate(-1);
        }
      }
      setIsSearching(false);
    }, 1000);
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="search-process">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (
      searchResultsSongs?.length === 0 &&
      searchResultsAlbums?.length === 0 &&
      searchResultsArtists?.length === 0
    ) {
      return (
        <div className="search-process">
          <p>
            Ничего с названием <b>{searchQuery}</b> не найдено
          </p>
        </div>
      );
    }

    return (
      <div className="search-results">
        {searchResultsSongs?.length > 0 && (
          <>
            <h3>Треки</h3>
            <SongsList
              songs={searchResultsSongs}
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
        {searchResultsAlbums?.length > 0 && (
          <>
            <h3>Альбомы</h3>
            <div className="media-albums">
              {searchResultsAlbums.map((album) => (
                <Media
                  key={`album-${album.AlbumID}`}
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
        {searchResultsArtists?.length > 0 && (
          <>
            <h3>Артисты</h3>
            <div className="media-artist">
              {searchResultsArtists.map((artist) => (
                <Media
                  key={`artist-${artist.ArtistID}`}
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
  };

  return (
    <div style={appStyle}>
      {location.pathname !== "/login" &&
        location.pathname !== "/recoveryPassword" &&
        location.pathname !== "/registration" && (
          <Header
            user={user}
            setUser={setUser}
            onSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        )}
      <Routes>
        <Route path="/Diplomnaya-rabota/" element={<Main />} />
        <Route
          path="/main"
          element={
            <MainPage
              songs={allSongs}
              albums={albums}
              artists={artists}
              playlists={playlists}
            />
          }
        />
        <Route path="/settings" element={<SettingsPage setUser={setUser} />} />
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
              songs={allSongs}
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
              setSongs={setAllSongs}
              songs={allSongs}
              onSongSelect={handleSongSelect}
              userData={user}
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
              setSongs={setAllSongs}
              songs={allSongs}
              onSongSelect={handleSongSelect}
              searchQuery={searchQuery}
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
              setSongs={setAllSongs}
              songs={allSongs}
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
              setSongs={setAllSongs}
              songs={allSongs}
              onSongSelect={handleSongSelect}
            />
          }
        />
        <Route path="/albumList" element={<AlbumList />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
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
              songs={allSongs}
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
            key={currentSong ? currentSong.SongID : "no-song"}
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
            songs={allSongs}
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
