import React, { useState, useEffect } from "react";
import "./UserAccountPage.css";
import UserBackgroundDefault from "../assets/UserBackgroundDefault.jpg";
import Artist from "../components/Media";
import { useNavigate, useLocation } from "react-router-dom";
import Songs from "../components/Songs";
import Album from "../components/Album";
import { AddToPlaylistModalWindow } from "../components/ModalWindows";

const UserAccountPage = ({
  isPlaying,
  currentSong,
  currentTime,
  toggleSongPlay,
  onLikeChange,
  onSongSelect,
  userData,
  songs,
  setSongs,
}) => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [favoritePlaylists, setFavoritePlaylists] = useState([]);
  const [makePlaylists, setMakePlaylists] = useState([]);
  useEffect(() => {
    const urlFavoriteArtists = `http://localhost:5000/api/favouriteArtists/${userData.UserID}`;
    const getDataFavoriteArtists = async () => {
      try {
        const res = await fetch(urlFavoriteArtists);
        if (res.ok) {
          let json = await res.json();
          setFavoriteArtists(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка ", error);
      }
    };
    getDataFavoriteArtists();
    const urlFavoriteSongs = `http://localhost:5000/api/favouriteSongs/${userData.UserID}`;
    const getDataFavoriteSongs = async () => {
      try {
        const res = await fetch(urlFavoriteSongs);
        if (res.ok) {
          let json = await res.json();
          setSongs(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    };
    getDataFavoriteSongs();
    const urlFavoriteAlbums = `http://localhost:5000/api/favouriteAlbums/${userData.UserID}`;
    const getDataFavoriteAlbums = async () => {
      try {
        const res = await fetch(urlFavoriteAlbums);
        if (res.ok) {
          let json = await res.json();
          setFavoriteAlbums(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    };
    getDataFavoriteAlbums();
    const urlFavoritePlaylists = `http://localhost:5000/api/favouritePlaylists/${userData.UserID}`;
    const getDataFavoritePlaylists = async () => {
      try {
        const res = await fetch(urlFavoritePlaylists);
        if (res.ok) {
          let json = await res.json();
          setFavoritePlaylists(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    };
    getDataFavoritePlaylists();
  }, [setSongs]);
  useEffect(() => {
    const urlMakePlaylists = `http://localhost:5000/api/makePlaylists/${userData.UserID}`;
    const getDataMakePlaylists = async () => {
      try {
        const res = await fetch(urlMakePlaylists);
        if (res.ok) {
          let json = await res.json();
          setMakePlaylists(json);
        } else {
          console.log("Ошибка" + res.status);
        }
      } catch (error) {
        console.error("Ошибка", error);
      }
    };
    getDataMakePlaylists();
  }, [makePlaylists]);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ИЗБРАННОЕ");
  const [activeCategory, setActiveCategory] = useState("Исполнители");
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const getCategoryStyle = (category) => {
    return {
      border: "1px solid black",
      borderRadius: "30px",
      padding: "5px 20px",
      fontSize: "20px",
      backgroundColor: activeCategory === category ? "grey" : "transparent",
      cursor: "pointer",
    };
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabStyle = (tab) => {
    return {
      cursor: "pointer",
      fontWeight: activeTab === tab ? "bold" : "normal",
      padding: "10px",
      borderBottom: activeTab === tab ? "2px solid black" : "none",
    };
  };

  const handleEditClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setCreatePlaylistModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreatePlaylistModalOpen(false);
    setSelectedPlaylist(null);
  };

  const renderCreatedContent = () => {
    return (
      <div className="favourites-playlists">
        {makePlaylists.map((playlist) => (
          <Artist
            key={playlist.PlaylistID}
            item={playlist}
            type="album"
            onClick={() =>
              navigate(`/playlist/${playlist.PlaylistID}`, {
                state: { playlist: playlist },
              })
            }
            showEditIcon={activeTab === "СОЗДАННОЕ"}
            onClickEdit={() => handleEditClick(playlist)}
          />
        ))}
        {createPlaylistModalOpen && (
          <AddToPlaylistModalWindow
            onClose={handleCloseModal}
            isPlaying={isPlaying}
            currentSong={currentSong}
            currentTime={currentTime}
            toggleSongPlay={toggleSongPlay}
            onLikeChange={onLikeChange}
            onSongSelect={onSongSelect}
            initialModal="editPlaylist"
            selectedPlaylist={selectedPlaylist}
          />
        )}
      </div>
    );
  };

  return (
    <div className="userPage">
      <div className="cover-userPage">
        <img
          className="background-userPage"
          src={userData.PhotoBackground || UserBackgroundDefault}
          alt="Background"
        />
        <div className="photoes-user">
          <img src={userData.PhotoProfile} alt="user cover" />
          <h1>{userData.Nickname}</h1>
        </div>
      </div>

      <div className="inner-menu">
        <h1
          style={getTabStyle("ИЗБРАННОЕ")}
          onClick={() => handleTabClick("ИЗБРАННОЕ")}
        >
          ИЗБРАННОЕ
        </h1>
        <h1
          style={getTabStyle("СОЗДАННОЕ")}
          onClick={() => handleTabClick("СОЗДАННОЕ")}
        >
          СОЗДАННОЕ
        </h1>
      </div>

      {activeTab === "ИЗБРАННОЕ" && (
        <div className="component-elected">
          <div className="menu-elected-component">
            <div
              style={getCategoryStyle("Исполнители")}
              onClick={() => handleCategoryClick("Исполнители")}
            >
              Исполнители
            </div>
            <div
              style={getCategoryStyle("Треки")}
              onClick={() => handleCategoryClick("Треки")}
            >
              Треки
            </div>
            <div
              style={getCategoryStyle("Плейлисты")}
              onClick={() => handleCategoryClick("Плейлисты")}
            >
              Плейлисты
            </div>
            <div
              style={getCategoryStyle("Альбомы")}
              onClick={() => handleCategoryClick("Альбомы")}
            >
              Альбомы
            </div>
          </div>

          <div
            className="array-favourites"
            style={{
              backgroundColor:
                activeCategory === "Альбомы"
                  ? "transparent"
                  : "rgb(233, 233, 233)",
            }}
          >
            {activeCategory === "Исполнители" && (
              <div className="favourites-artists">
                {favoriteArtists.map((artist) => (
                  <Artist
                    key={artist.ArtistID}
                    item={artist}
                    type="artist"
                    onClick={() =>
                      navigate(`/singer/${artist.ArtistID}`, {
                        state: { artist: artist },
                      })
                    }
                  />
                ))}
              </div>
            )}

            {activeCategory === "Треки" && (
              <div className="songs-list-fav">
                {songs.map((song) => (
                  <Songs
                    key={song.SongID}
                    song={song}
                    isPlaying={isPlaying}
                    currentSong={currentSong}
                    currentTime={currentTime}
                    toggleSongPlay={toggleSongPlay}
                    onLikeChange={onLikeChange}
                    onSongSelect={onSongSelect}
                  />
                ))}
              </div>
            )}

            {activeCategory === "Плейлисты" && (
              <div className="favourites-playlists">
                {favoritePlaylists.map((playlist) => (
                  <Artist
                    key={playlist.PlaylistID}
                    item={playlist}
                    type="album"
                    onClick={() =>
                      navigate(`/playlist/${playlist.PlaylistID}`, {
                        state: { playlist: playlist },
                      })
                    }
                  />
                ))}
              </div>
            )}

            {activeCategory === "Альбомы" && (
              <div className="favourites-albums">
                {favoriteAlbums.map((album) => (
                  <Album
                    key={album.AlbumID}
                    album={album}
                    onClick={() =>
                      navigate(`/album/${album.AlbumID}`, { state: { album } })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "СОЗДАННОЕ" && (
        <div
          className="array-favourites"
          style={{ backgroundColor: "rgb(233, 233, 233)" }}
        >
          {renderCreatedContent()}
        </div>
      )}
    </div>
  );
};

export default UserAccountPage;
