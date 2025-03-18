import React, { useState, useEffect } from "react";
import "./Player.css";
import shuffle from "../assets/shuffle.png";
import repeat from "../assets/repeat.png";
import next from "../assets/next.png";
import dinamic from "../assets/dinamic.png";
import lyrics from "../assets/lyrics.png";
import liked from "../assets/liked.png";
import play from "../assets/play.png";
import pause from "../assets/pause.png";

const Player = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  audioRef,
  onSeek,
  currentTime,
  duration,
}) => {
  const [seekValue, setSeekValue] = useState(0);

  const handleSeekChange = (e) => {
    const newValue = e.target.value;
    setSeekValue(newValue);
    const newTime = (parseFloat(newValue) / 100) * duration;
    if (!isNaN(newTime) && duration > 0) {
      audioRef.current.currentTime = newTime;
      onSeek(newTime);
    }
  };

  useEffect(() => {
    if (currentSong) {
      setSeekValue((currentTime / duration) * 100 || 0); // Correctly calculate initial seek value
    }
  }, [currentTime, duration, currentSong]);

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "00:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="player-card">
      <div className="main-part">
        {currentSong && (
          <>
            <div className="cover-artist-title">
              <img
                className="cover"
                src={currentSong.cover}
                height={"50px"}
                width={"50px"}
                alt="Cover"
              />
              <div>
                <p>{currentSong.artist}</p>
                <p>{currentSong.title}</p>
              </div>
              <img className="icon-liked" src={liked} alt="Liked" />
            </div>
          </>
        )}
        <div className="player-icons">
          <img
            src={isPlaying ? pause : play}
            onClick={onTogglePlay}
            alt={isPlaying ? "Pause" : "Play"}
          />
          <img src={next} alt="Next" />
          <img src={next} alt="Previous" />
          <img src={shuffle} alt="Shuffle" />
          <img src={repeat} alt="Repeat" />
        </div>
        <div className="other-icons">
          <img src={dinamic} alt="Dinamic" />
          <img src={lyrics} alt="Lyrics" />
        </div>
      </div>
      <div className="duration-music-line">
        <p>{formatTime(currentTime)}</p>
        <div className="audio-line">
          <input
            type="range"
            min="0"
            max="100"
            value={seekValue || 0}
            onChange={handleSeekChange}
          />
        </div>
        <p>{formatTime(duration)}</p>
      </div>
    </div>
  );
};

export default Player;
