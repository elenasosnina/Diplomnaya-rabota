import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Player.css";
import shuffle from "../assets/shuffle.png";
import repeatImg from "../assets/repeat.png";
import next from "../assets/next.png";
import dinamic from "../assets/dinamic.png";
import lyrics from "../assets/lyrics.png";
import maxPlayerImg from "../assets/maximize.png";
import minPlayerImg from "../assets/maximize.png";
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
  playNextSong,
  playPreviousSong,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  songs,
  onSongSelect,
  isMaximized,
  setIsMaximized,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [volume, setVolume] = useState(50);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [currentShuffledIndex, setCurrentShuffledIndex] = useState(0);
  const [isLyricsVisible, setIsLyricsVisible] = useState(false);
  const [songText, setSongText] = useState("");
  const playerCardRef = useRef(null);
  const [cardStyle, setCardStyle] = useState({});

  useEffect(() => {
    if (playerCardRef.current) {
      if (!currentSong) {
        playerCardRef.current.classList.add("empty");
      } else {
        playerCardRef.current.classList.remove("empty");
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (currentSong && currentSong.lyricsUrl) {
        try {
          setSongText(
            `Lyrics for ${currentSong.title} - ${currentSong.artist} would be here.\n(Simulated)`
          );
        } catch (error) {
          console.error("Error fetching lyrics:", error);
          setSongText("Error loading lyrics.");
        }
      } else {
        setSongText("");
      }
    };
    fetchLyrics();
  }, [currentSong]);

  const handleMouseEnter = () => {
    if (!currentSong) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSeekChange = (e) => {
    const newValue = e.target.value;
    setSeekValue(newValue);
    const newTime = (parseFloat(newValue) / 100) * duration;
    if (!isNaN(newTime) && duration > 0) {
      onSeek(newTime); // Corrected: Calling onSeek instead of directly setting audioRef.current.currentTime
    }
  };

  const likeClick = () => {
    if (!currentSong) return;
    onLikeChange(currentSong.id, !currentSong.liked);
  };

  const playedPercentage = (currentTime / duration) * 100 || 0;

  useEffect(() => {
    if (currentSong && duration) {
      setSeekValue(playedPercentage);
      setShowSlider(true);
    } else {
      setShowSlider(false);
      setSeekValue(0);
    }
  }, [currentTime, duration, currentSong, playedPercentage]);

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

  const playNextShuffledSong = useCallback(() => {
    if (shuffledSongs && shuffledSongs.length > 0) {
      let nextIndex = currentShuffledIndex + 1;
      if (nextIndex >= shuffledSongs.length) {
        // If we reach the end, shuffle and start from the beginning
        const shuffled = [...songs].sort(() => Math.random() - 0.5);
        setShuffledSongs(shuffled);
        nextIndex = 0;
      }
      setCurrentShuffledIndex(nextIndex);
      onSongSelect(shuffledSongs[nextIndex]);
    }
  }, [shuffledSongs, currentShuffledIndex, songs, onSongSelect]);

  const handleEnded = useCallback(() => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.error("Error autoplaying after repeat:", error);
        });
      }
    } else {
      if (isShuffle) {
        playNextShuffledSong();
      } else {
        playNextSong();
      }
    }
  }, [isRepeat, isShuffle, playNextSong, playNextShuffledSong, audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [handleEnded, audioRef]);

  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setVolume(newVolume);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [audioRef, volume]);

  const handleNextClick = useCallback(() => {
    if (isShuffle) {
      playNextShuffledSong();
    } else {
      playNextSong();
    }
  }, [isShuffle, playNextSong, playNextShuffledSong]);

  const handleNextClickFullScreen = useCallback(() => {
    if (isShuffle) {
      playNextShuffledSong();
    } else {
      playNextSong();
    }
    setIsMaximized(true);
  }, [isShuffle, playNextSong, playNextShuffledSong, setIsMaximized]);

  const isDisabled = !currentSong;

  const PlayerControls = () => (
    <div className="player-icons">
      <img
        src={shuffle}
        alt="Shuffle"
        style={{
          width: "30px",
          height: "30px",
          cursor: "pointer",
          opacity: isShuffle ? 1 : 0.7,
        }}
        onClick={isDisabled ? null : onToggleShuffle}
        className={isDisabled ? "disabled" : ""}
        role="button"
        aria-label="Toggle Shuffle"
      />
      <img
        style={{ width: "30px", height: "30px", transform: "rotate(180deg)" }}
        src={next}
        alt="Previous"
        onClick={isDisabled ? null : playPreviousSong}
        className={isDisabled ? "disabled" : ""}
        role="button"
        aria-label="Play Previous"
      />
      <img
        style={{ width: "30px", height: "30px" }}
        src={isPlaying ? pause : play}
        onClick={isDisabled ? null : onTogglePlay}
        alt={isPlaying ? "Pause" : "Play"}
        className={isDisabled ? "disabled" : ""}
        role="button"
        aria-label={isPlaying ? "Pause" : "Play"}
      />
      {isMaximized ? (
        <img
          style={{ width: "30px", height: "30px" }}
          src={next}
          alt="Next"
          onClick={isDisabled ? null : handleNextClickFullScreen}
          className={isDisabled ? "disabled" : ""}
          role="button"
          aria-label="Play Next"
        />
      ) : (
        <img
          style={{ width: "30px", height: "30px" }}
          src={next}
          alt="Next"
          onClick={isDisabled ? null : handleNextClick}
          className={isDisabled ? "disabled" : ""}
          role="button"
          aria-label="Play Next"
        />
      )}
      <img
        src={repeatImg}
        alt="Repeat"
        onClick={isDisabled ? null : onToggleRepeat}
        style={{
          width: "30px",
          height: "30px",
          cursor: "pointer",
          opacity: isRepeat ? 1 : 0.7,
        }}
        className={isDisabled ? "disabled" : ""}
        role="button"
        aria-label="Toggle Repeat"
      />
    </div>
  );

  const AudioSlider = () =>
    showSlider && (
      <div className="duration-music-line">
        <div className="audio-line">
          <input
            style={{
              width: "100%",
              "--played-percentage": `${playedPercentage}%`,
              appearance: "none",
              height: "8px",
              background:
                "linear-gradient(to right,rgb(255, 255, 255) var(--played-percentage), rgba(216, 215, 215, 0.5) var(--played-percentage))",
              outline: "none",
              transition: "background 0.2s ease-in-out",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            type="range"
            min="0"
            max="100"
            value={seekValue}
            onChange={handleSeekChange}
            step="0.5"
            aria-label="Seek track"
          />
        </div>
        <p style={{ color: "white", paddingLeft: "20px" }}>
          {formatTime(currentTime)}
        </p>
      </div>
    );

  const VolumeControl = () => (
    <>
      <img
        src={dinamic}
        alt="Dinamic"
        style={{
          width: "30px",
          height: "30px",
          cursor: currentSong ? "pointer" : "default",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={isDisabled ? "disabled" : ""}
        role="button"
        aria-label="Volume Control"
      />
      {isHovered && (
        <div
          style={{
            paddingLeft: "30px",
            position: "absolute",
            bottom: "170px",
            right: "-18px",
            transform: "rotate(-90deg)",
            color: "black",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="volume-range">
            <p style={{ transform: "rotate(90deg)", margin: "0" }}>{volume}</p>
            <input
              className="volume"
              style={{ width: "150px" }}
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Change volume"
            />
          </div>
        </div>
      )}
    </>
  );

  const toggleLyricsVisibility = () => {
    setIsLyricsVisible((prev) => !prev);
  };

  const LyricsButton = () => (
    <img
      src={lyrics}
      alt="Lyrics"
      style={{ width: "30px", height: "30px" }}
      onClick={isDisabled ? null : toggleLyricsVisibility}
      className={isDisabled ? "disabled" : ""}
      role="button"
      aria-label="View Lyrics"
    />
  );

  const LikeButton = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill={currentSong && currentSong.liked ? "white" : "none"}
      stroke="white"
      strokeWidth="2"
      onClick={likeClick}
      className="icon-liked"
      role="button"
      aria-label={currentSong && currentSong.liked ? "Unlike" : "Like"}
    >
      <path
        strokeLinejoin="round"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );

  const MaxPlayer = () => (
    <img
      style={{ width: "30px", height: "30px" }}
      src={isMaximized ? minPlayerImg : maxPlayerImg} // Toggle between maximize and minimize icons
      alt="maxPlayer"
      className={isDisabled ? "disabled" : ""}
      role="button"
      aria-label="Toggle Max Player"
      onClick={() => setIsMaximized(!isMaximized)}
    />
  );

  return (
    <div
      className={`player-card ${isMaximized ? "maximized" : ""}`}
      style={cardStyle}
      ref={playerCardRef}
    >
      {!isLyricsVisible && (
        <>
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
                  <LikeButton />
                </>
              )}
            </div>
            <PlayerControls />
            <div className="other-icons">
              <VolumeControl />
              <LyricsButton />
              <MaxPlayer />
            </div>
          </div>
          <AudioSlider />
        </>
      )}
      {isLyricsVisible && (
        <div className="text-songs">
          <div onClick={toggleLyricsVisibility}>✕</div>
          <p>{songText}</p>
        </div>
      )}
    </div>
  );
};

export default Player;
