import React, { useState } from "react";
import "./PlaylistPage.css";
import Song from "../components/Songs";
import coverPlaylist from "../assets/login.jpg";
import Dropdown from "../components/MenuSong";

const PlaylistPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const options = [
    {
      label: "Поделиться",
      action: () => {
        console.log("Поделиться нажато");
      },
    },
    {
      label: "Посмотреть сведения",
      action: () => {
        console.log("Посмотреть сведения нажато");
      },
    },
    {
      label: "Добавить в плейлист",
      action: () => {
        console.log("Добавить в плейлист нажато");
      },
    },
  ];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <main className="tracklist-page">
      <div className="card-tracklist">
        <div className="card-info">
          <div
            className="block-menu-playlist"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="menu-playlist"></button>
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
          <div className="playlist-cover">
            <img src={coverPlaylist} alt="Cover" />
            <div className="listen-counter">204</div>
          </div>
          <div className="playlist-info">
            <p>
              <b>Billie Eilish</b>
            </p>
            <p style={{ fontSize: "18px", marginTop: "30px" }}>4 ч 32 м</p>
            <p style={{ fontSize: "25px", marginTop: "0px" }}>user1</p>
          </div>
        </div>
        <div className="tracklist">
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
        </div>
      </div>
    </main>
  );
};

export default PlaylistPage;
