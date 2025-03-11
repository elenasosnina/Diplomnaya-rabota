import React, { useRef, useState } from "react";
import "./Songs.css";
import coverSong from "../assets/party.webp";
import audioCover from "../assets/Justin Bieber - All Around The World.mp3";
import Dropdown from "./MenuSong";
import Player from "./Player";

const Songs = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const likeClick = () => {
    setIsFilled(!isFilled);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div className="card-song">
      <div className="cover-title-song">
        <div className="cover" onClick={handleClick}>
          <img
            className="cover"
            src={coverSong}
            height={"50px"}
            width={"50px"}
            alt="Cover"
          />
          <div className={`play-icon ${isPlaying ? "pause" : "play"}`}>
            {isPlaying ? (
              <div className="pause-icon">
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            ) : (
              <div className="play-icon-triangle"></div>
            )}
          </div>
        </div>
        <audio ref={audioRef} src={audioCover}></audio>
        <div className="title-singer">
          <p>Chota</p>
          <p>Somebody</p>
        </div>
      </div>
      <div className="timing-menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isFilled ? "black" : "none"}
          stroke="black"
          strokeWidth="1"
          onClick={likeClick}
          style={{ cursor: "pointer" }}
          className="hidden-svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {/* SVG элементы будут скрыты по умолчанию и появятся при наведении на card-song */}
        <svg
          className="hidden-svg"
          style={{ padding: "15px 0px 0px 0px" }}
          width="60"
          height="50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <circle cx="10" cy="10" r="5" fill="black" />
          <circle cx="25" cy="10" r="5" fill="black" />
          <circle cx="40" cy="10" r="5" fill="black" />
        </svg>
        <p>4:12</p>
        {isHovered && (
          <div
            className="menu-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Dropdown />
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs;
