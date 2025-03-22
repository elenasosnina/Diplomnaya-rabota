import React, { useState, useEffect, useRef } from "react";
import "./Player.css";
import shuffle from "../assets/shuffle.png";
import repeatImg from "../assets/repeat.png";
import next from "../assets/next.png";
import dinamic from "../assets/dinamic.png";
import lyrics from "../assets/lyrics.png";
import maxPlayer from "../assets/maximize.png";
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
  onLikeChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [volume, setVolume] = useState(50); // Volume state

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleSeekChange = (e) => {
    // перемотка песни
    const newValue = e.target.value; //новое значение из события
    setSeekValue(newValue);

    const newTime = (parseFloat(newValue) / 100) * duration;
    if (!isNaN(newTime) && duration > 0) {
      audioRef.current.currentTime = newTime;
      onSeek(newTime);
    }
  };

  const likeClick = () => {
    onLikeChange(song.id, !song.liked);
  };

  const playedPercentage = (currentTime / duration) * 100;

  useEffect(() => {
    if (currentSong) {
      //выбрана ли текущая песня
      setSeekValue(playedPercentage || 0); // отражение длительности
      setShowSlider(true); // видимость полосы
    } else {
      setShowSlider(false);
    }
  }, [currentTime, duration, currentSong]); //функция будет вызываться каждый раз, когда изменяются значения currentTime, duration или currentSong

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

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  useEffect(() => {
    const handleEnded = () => {
      if (isRepeating) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.error("Error autoplaying after repeat:", error);
        });
      }
    };

    if (currentSong) {
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        audioRef.current.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentSong, isRepeating, audioRef]);

  // Function to handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setVolume(newVolume);

    // Update audio volume
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100; // Volume is between 0 and 1
    }
  };

  // Effect to set initial volume and update on component mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [audioRef, volume]);
  return (
    <div className="player-card">
      <div className="main-part">
        <div className="cover-artist-title">
          {currentSong && (
            <>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 0 24 24"
                fill={currentSong.liked ? "white" : "none"}
                stroke="white"
                strokeWidth="2"
                onClick={likeClick}
                className="icon-liked"
              >
                <path
                  stroke-linejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </>
          )}
        </div>

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
            src={repeatImg}
            alt="Repeat"
            onClick={toggleRepeat}
            style={{
              width: "20px",
              height: "20px",
              marginLeft: "60px",
              opacity: isRepeating ? 1 : 0.7,
              cursor: "pointer",
            }}
          />
        </div>

        <div
          className="other-icons"
          style={{
            marginLeft: "30px",
          }}
        >
          <img
            className="dinamic"
            src={dinamic}
            alt="Dinamic"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "pointer" }}
          />
          {isHovered && (
            <div
              style={{
                paddingLeft: "30px",
                position: "absolute",
                bottom: "190px",
                right: "-25px",
                transform: "rotate(-90deg)",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="volume-range">
                <p
                  style={{
                    transform: "rotate(90deg)",
                    margin: "0",
                  }}
                >
                  {volume}
                </p>
                <input
                  className="volume"
                  style={{
                    width: "150px",
                  }}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volume}
                  onChange={handleVolumeChange} // Use handleVolumeChange
                />
              </div>
            </div>
          )}

          <img src={lyrics} alt="Lyrics" />
          <img src={maxPlayer} alt="maxPlayer" />
        </div>
      </div>

      {showSlider && (
        <div className="duration-music-line">
          <div className="audio-line">
            <input
              style={{
                width: "100%",
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
          <p style={{ color: "white", paddingLeft: "20px" }}>
            {formatTime(currentTime)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Player;
