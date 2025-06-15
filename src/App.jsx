import React, { useEffect, useState, useRef, useCallback } from "react";
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
import AlbumSongs from "./pages/AlbumPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";
import Media from "./components/Media";
import GenresPage from "./pages/GenresPage";
import Songs from "./components/Songs";
import ManageMusic from "./components/ManageMusic";
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
  const [isMaximized, setIsMaximized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [searchResultsSongs, setSearchResultsSongs] = useState([]);
  const [searchResultsAlbums, setSearchResultsAlbums] = useState([]);
  const [searchResultsArtists, setSearchResultsArtists] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const [user, setUser] = useState();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getSongsData = useCallback(async () => {
    try {
      if (!user?.UserID) return;
      const res = await fetch("http://localhost:5000/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: user.UserID }),
      });
      if (res.ok) {
        const json = await res.json();
        setAllSongs(json);
        setSongs(json);
      }
    } catch (error) {
      console.error("Ошибка при загрузке песен:", error);
    }
  }, [user?.UserID, setSongs]);
  const getDataAlbums = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/albums");
      if (res.ok) setAlbums(await res.json());
    } catch (error) {
      console.error("Ошибка при загрузке альбомов:", error);
    }
  }, []);
  const getDataPlaylists = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/playlists");
      if (res.ok) setPlaylists(await res.json());
    } catch (error) {
      console.error("Ошибка при загрузке плейлистов:", error);
    }
  }, []);
  const getDataArtists = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/artists");
      if (res.ok) setArtists(await res.json());
    } catch (error) {
      console.error("Ошибка при загрузке артистов:", error);
    }
  }, []);
  useEffect(() => {
    getSongsData();
    getDataAlbums();
    getDataPlaylists();
    getDataArtists();
  }, [getSongsData, getDataAlbums, getDataPlaylists, getDataArtists]);
  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
      setIsSearching(false);
      setSearchResultsSongs([]);
      setSearchResultsAlbums([]);
      setSearchResultsArtists([]);
    }
  }, [location.pathname]);
  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query);
      setIsSearching(true);
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(() => {
        if (query) {
          const lowerQuery = query.toLowerCase();
          setSearchResultsSongs(
            allSongs.filter((song) =>
              song.Title?.toLowerCase().includes(lowerQuery)
            )
          );
          setSearchResultsAlbums(
            albums.filter((album) =>
              album.Title?.toLowerCase().includes(lowerQuery)
            )
          );
          setSearchResultsArtists(
            artists.filter((artist) =>
              artist.Nickname?.toLowerCase().includes(lowerQuery)
            )
          );
        } else {
          setSearchResultsSongs([]);
          setSearchResultsAlbums([]);
          setSearchResultsArtists([]);
          if (location.pathname === "/search") navigate(-1);
        }
        setIsSearching(false);
      }, 500);
    },
    [allSongs, albums, artists, location.pathname, navigate]
  );

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
      !searchResultsSongs.length &&
      !searchResultsAlbums.length &&
      !searchResultsArtists.length
    ) {
      return (
        <div className="search-process">
          <p>
            {" "}
            Ничего с названием <b>{searchQuery}</b> не найдено{" "}
          </p>
        </div>
      );
    }

    return (
      <div className="search-results">
        {searchResultsSongs.length > 0 && (
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
        {searchResultsAlbums.length > 0 && (
          <>
            <h3>Альбомы</h3>
            <div className="media-albums">
              {searchResultsAlbums.map((album) => (
                <Media
                  key={`album-${album.AlbumID}`}
                  item={album}
                  type="album"
                  onClick={() =>
                    navigate(`/album/${album.AlbumID}`, {
                      state: { album },
                    })
                  }
                />
              ))}
            </div>
          </>
        )}
        {searchResultsArtists.length > 0 && (
          <>
            <h3>Артисты</h3>
            <div className="media-artist">
              {searchResultsArtists.map((artist) => (
                <Media
                  key={`artist-${artist.ArtistID}`}
                  item={artist}
                  type="artist"
                  onClick={() =>
                    navigate(`/singer/${artist.ArtistID}`, {
                      state: { artist },
                    })
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  const handleArtistClick = (artistNickname) => {
    const foundArtist = artists.find(
      (artist) => artist.Nickname === artistNickname
    );
    if (foundArtist) {
      navigate(`/singer/${foundArtist.ArtistID}`, {
        state: { artist: foundArtist },
      });
    } else {
      console.log("Артист не найден:", artistNickname);
    }
  };

  return (
    <div style={appStyle}>
      {!["/login", "/registration"].includes(location.pathname) && (
        <Header
          user={user}
          setUser={setUser}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
      )}
      <Routes>
        <Route path="/" element={<Main />} />
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
        <Route
          path="/songs-genres/:genreID"
          element={
            <GenresPage
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              onSongSelect={handleSongSelect}
              setSongs={setSongs}
              songs={songs}
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
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              onSongSelect={handleSongSelect}
              userData={user}
              setSongs={setSongs}
              songs={songs}
            />
          }
        />
        <Route
          path="/playlist/:playlistID"
          element={
            <PlaylistPage
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              onSongSelect={handleSongSelect}
              setSongs={setSongs}
              songs={songs}
            />
          }
        />
        <Route
          path="/singer/:singerID"
          element={
            <SingerPage
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              onSongSelect={handleSongSelect}
              setSongs={setSongs}
              songs={songs}
            />
          }
        />
        <Route
          path="/album/:albumID"
          element={
            <AlbumSongs
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              audioRef={audioRef}
              onSongSelect={handleSongSelect}
              setSongs={setSongs}
              songs={songs}
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
              songs={songs}
              isPlaying={isPlaying}
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              toggleSongPlay={toggleSongPlay}
              onLikeChange={handleLikeChange}
              onSongSelect={handleSongSelect}
              handleArtistClick={handleArtistClick}
            />
          }
        />
        <Route path="/search" element={renderSearchResults()} />
      </Routes>
      {!["/login", "/registration"].includes(location.pathname) && (
        <>
          <Footer />
          <Player
            key={currentSong?.SongID || "no-song"}
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
        </>
      )}
    </div>
  );
};
const MainApp = () => (
  <Router basename="/impulse">
    <App />
  </Router>
);
export default MainApp;
