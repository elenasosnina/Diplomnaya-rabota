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
  const [showSlider, setShowSlider] = useState(false);
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
      setSeekValue((currentTime / duration) * 100 || 0);
      setShowSlider(true); // Show the slider when a song is loaded
    } else {
      setShowSlider(false); // Hide the slider if no song is loaded
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
  const playedPercentage = (currentTime / duration) * 100;
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
              <div className="song-information">
                <p>{currentSong.title}</p>
                <p>{currentSong.artist}</p>
              </div>
              <img className="icon-liked" src={liked} alt="Liked" />
            </div>
          </>
        )}

        <div className="player-icons">
          <img
            src={shuffle}
            alt="Shuffle"
            style={{
              width: "20px",
              opacity: "0.7",
              height: "20px",
              marginRight: "60px",
            }}
          />
          <img
            style={{ transform: "rotate(180deg)" }}
            src={next}
            alt="Previous"
          />
          <img
            src={isPlaying ? pause : play}
            onClick={onTogglePlay}
            alt={isPlaying ? "Pause" : "Play"}
          />
          <img src={next} alt="Next" />

          <img
            src={repeat}
            alt="Repeat"
            style={{
              width: "20px",
              height: "20px",
              marginLeft: "60px",
              opacity: "0.7",
            }}
          />
        </div>

        <div
          className="other-icons"
          style={{
            marginLeft: "30px",
          }}
        >
          <img src={dinamic} alt="Dinamic" />
          <img src={lyrics} alt="Lyrics" />
        </div>
      </div>

      {showSlider && (
        <div className="duration-music-line">
          <div className="audio-line">
            <input
              style={{
                width: "1220px",
                "--played-percentage": `${playedPercentage}%`,
                appearance: "none",
                height: "8px",
                background:
                  "linear-gradient(to right,rgb(255, 255, 255) var(--played-percentage), rgba(216, 215, 215, 0.5) var(--played-percentage))" /* градиент для заполненной и незаполненной части */,
                outline: "none",
                transition: "background 0.2s ease-in-out",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              type="range"
              min="0"
              max="100"
              value={seekValue || 0}
              onChange={handleSeekChange}
              step="0.5"
            />
          </div>
          <p style={{ color: "white" }}>{formatTime(currentTime)}</p>
        </div>
      )}
    </div>
  );
};

export default Player;
