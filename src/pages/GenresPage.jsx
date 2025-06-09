import React, { useState, useEffect } from "react";
import "./GenresPage.css";
import { useLocation } from "react-router-dom";
import coverSong from "../assets/party.webp";
import Songs from "../components/Songs";

const GenresPage = ({
  isPlaying,
  currentSong,
  currentTime,
  toggleSongPlay,
  onLikeChange,
  onSongSelect,
  songs,
  setSongs,
}) => {
  const location = useLocation();
  const genreItem = location.state?.genreItem;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!genreItem || !genreItem.GenreID) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const url = `http://localhost:5000/api/genres/songs/${genreItem.GenreID}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSongs(data);
      } catch (e) {
        console.error("Ошибка при загрузке песен:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreItem]);

  const LoadingIndicator = () => (
    <div className="search-process">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="songs-genre-list">
      <div className="genre-container">
        <img
          className="genre-cover"
          src={genreItem?.PhotoCover}
          alt="Genre Cover"
        />
        <h1 className="title-genre">{genreItem?.Title}</h1>
      </div>
      <div className="genre-song-list">
        {songs && songs.length > 0 ? (
          songs.map((song) => (
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
          ))
        ) : (
          <div>Пока песен в этом жанре нет на сайте</div>
        )}
      </div>
    </div>
  );
};

export default GenresPage;
