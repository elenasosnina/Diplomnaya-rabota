import React, { useState, useRef, useCallback, useEffect } from "react";
import "./PlaylistPage.css";
import Songs from "../components/Songs";
import coverPlaylist from "../assets/login.jpg";
import Dropdown from "../components/MenuSong";
import coverSong from "../assets/party.webp";
import coverSong2 from "../assets/login.jpg";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import audioCover2 from "../assets/Xxxtentacion_John_Cunningham_-_changes_54571393.mp3";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShareModalWindow,
  ModalWindowInformation,
} from "../components/ModalWindows";

const PlaylistPage = ({
  isPlaying,
  currentSong,
  currentTime,
  duration,
  toggleSongPlay,
  onLikeChange,
  audioRef,
  setSongs,
  songs,
  onSongSelect,
  searchQuery,
  searchResults,
  isSearching,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [initialSongs, setInitialSongs] = useState([
    {
      id: 1,
      title: "All Around The World",
      artist: "Justin Bieber",
      audio: audioCover,
      cover: coverSong,
      liked: true,
      lyrics: "cklfadsfdfdsfdfdgf",
      producer: "ufgsdufk",
      authorLyrics: "41324",
      composer: "ewreq",
      rights: "142343",
      duration: "01:02",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 2,
      title: "change",
      artist: "XXXTENTACION",
      audio: audioCover2,
      cover: coverSong2,
      liked: true,
      producer: "htfshfjh",
      authorLyrics: "24321413243",
      composer: "4321532413",
      rights: "324",
      lyrics: "32414",
      duration: "02:02",
      url: "https://jfgdhufdg.ru/playlist/fdgs41",
    },
    {
      id: 3,
      title: "Another Song",
      artist: "Some Artist",
      audio: audioCover,
      cover: coverSong,
      liked: false,
      producer: "jkj",
      authorLyrics: "hjh",
      composer: "jikj",
      rights: "khj",
      lyrics: "cklgf",
      duration: "02:22",
      url: "https://jfgdhufdg.ru/playlist/000hkjf",
    },
    {
      id: 4,
      title: "Yet Another Song",
      artist: "Different Artist",
      audio: audioCover2,
      cover: coverSong2,
      liked: false,
      producer: "jk32421j",
      authorLyrics: "h32421jh",
      composer: "j3241ikj",
      rights: "k343hj",
      lyrics: "ckl3432gf",
      duration: "02:32",
      url: "https://jfgdhufdg.ru/playlist/ewkhrueige4",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);

  useEffect(() => {
    setSongs(initialSongs);
  }, []);

  const handleOpenModal = (modalType) => {
    setIsModalOpen(true);
    setCurrentModal(modalType);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
  };

  const options = [
    {
      label: "Поделиться",
      action: () => {
        handleOpenModal("share");
      },
    },
    {
      label: "Добавить в избранное",
      action: () => {
        handleOpenModal("addToFav");
      },
    },
  ];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLikeChangeInternal = (songId, newLiked) => {
    const updatedSongs = songs.map((song) =>
      song.id === songId ? { ...song, liked: newLiked } : song
    );
    setSongs(updatedSongs);
    setSongs(updatedSongs);
  };

  const location = useLocation();
  const { playlist } = location.state || {};
  const navigate = useNavigate();

  const renderContent = () => {
    if (isSearching && searchQuery) {
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
                {searchResults.songs.map((song) => (
                  <Songs
                    key={song.id}
                    song={song}
                    isPlaying={isPlaying}
                    currentSong={currentSong}
                    currentTime={currentTime}
                    toggleSongPlay={toggleSongPlay}
                    onLikeChange={handleLikeChangeInternal}
                    onSongSelect={onSongSelect}
                  />
                ))}
              </>
            )}
            {searchResults.albums?.length > 0 && (
              <>
                <h3>Альбомы</h3>
                <div className="media-albums">
                  {searchResults.albums.map((album) => (
                    <div
                      key={album.id}
                      className="media-item"
                      onClick={() => {
                        navigate("/album");
                      }}
                    >
                      {album.title}
                    </div>
                  ))}
                </div>
              </>
            )}
            {searchResults.artists?.length > 0 && (
              <>
                <h3>Артисты</h3>
                <div className="media-artist">
                  {searchResults.artists.map((artist) => (
                    <div
                      key={artist.id}
                      className="media-item"
                      onClick={() => {
                        navigate("/singer");
                      }}
                    >
                      {artist.nickname}
                    </div>
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
              Ничего с названием <b>{searchQuery}</b> не найдено
            </p>
          </div>
        );
      }
    } else {
      return (
        <>
          <div className="card-tracklist">
            <div className="card-info">
              <div
                className="block-menu-playlist"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="menu-playlist"></div>
              </div>
              {isHovered && (
                <div
                  className="dropdown-container"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Dropdown options={options} />
                </div>
              )}
              {isModalOpen && (
                <div className="modal-overlay">
                  {currentModal === "share" && (
                    <ShareModalWindow
                      onClose={handleCloseModal}
                      link={playlist?.url}
                    />
                  )}
                  {currentModal === "addToFav" && (
                    <ModalWindowInformation
                      onClose={handleCloseModal}
                      showCancelButton={false}
                      confirmButtonText={"Ок"}
                      onConfirm={handleCloseModal}
                      message={"Выбранный плейлист добавлен в Избранное"}
                    />
                  )}
                </div>
              )}
              <div className="playlist-cover">
                <img src={playlist?.cover} alt="Cover" />
                <div className="listen-counter">204</div>
              </div>
              <div className="playlist-info">
                <p>
                  <b>{playlist?.title}</b>
                </p>
                <p style={{ fontSize: "18px", marginTop: "30px" }}>4 ч 32 м</p>
                <p style={{ fontSize: "25px", marginTop: "0px" }}>user1</p>
              </div>
            </div>
            <div className="tracklist">
              {songs.map((song) => (
                <Songs
                  key={song.id}
                  song={song}
                  isPlaying={isPlaying}
                  currentSong={currentSong}
                  currentTime={currentTime}
                  toggleSongPlay={toggleSongPlay}
                  onLikeChange={handleLikeChangeInternal}
                  onSongSelect={onSongSelect}
                />
              ))}
            </div>
          </div>
        </>
      );
    }
  };

  return <main className="tracklist-page">{renderContent()}</main>;
};

export default PlaylistPage;
