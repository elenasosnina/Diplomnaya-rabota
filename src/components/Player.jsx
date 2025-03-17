import React, { useRef, useState, useEffect } from "react";
import "./Player.css";
import coverSong from "../assets/party.webp";
import shuffle from "../assets/shuffle.png";
import repeat from "../assets/repeat.png";
import next from "../assets/next.png";
import dinamic from "../assets/dinamic.png";
import lyrics from "../assets/lyrics.png";
import liked from "../assets/liked.png";
import play from "../assets/play.png";
import pause from "../assets/pause.png";
// import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
const Player = ({ currentSong }) => {
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekValue, setSeekValue] = useState(0); // Add seekValue state

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.load(); // Important: Load the new source
      audioRef.current.play().catch((error) => {
        // Handle autoplay issues (browsers may block it)
        console.warn("Autoplay prevented:", error);
      });
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setSeekValue((audioRef.current.currentTime / duration) * 100);
  };

  const handleSeekChange = (e) => {
    const newValue = e.target.value;
    setSeekValue(newValue);
    const newTime = (parseFloat(newValue) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

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
                <p>Artist Name</p>
                <p>Song Title</p>
              </div>
              <img className="icon-liked" src={liked} />
            </div>
            <audio
              ref={audioRef}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
            />
          </>
        )}
        <div className="player-icons">
          <img src={isPlaying ? pause : play} onClick={handlePlayPause} />
          <img src={next} />
          <img src={next} />
          <img src={shuffle} />
          <img src={repeat} />
        </div>
        <div className="other-icons">
          <img src={dinamic} />
          <img src={lyrics} />
        </div>
      </div>
      <div className="duration-music-line">
        <p>{formatTime(currentTime)}</p> {/* Current time display */}
        <div className="audio-line">
          <input
            type="range"
            min="0"
            max="100"
            value={seekValue} // Use seekValue as the value
            onChange={handleSeekChange}
          />
        </div>
        <p>{formatTime(duration)}</p>
      </div>
    </div>
  );
};
export default Player;
