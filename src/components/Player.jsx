import React from "react";
import "./Player.css";

const Player = ({ isPlaying, onClose }) => {
  return (
    <div className="player-card">
      <h2>{isPlaying ? "Playing..." : "Paused"}</h2>
      <button onClick={onClose}>Close Player</button>
    </div>
  );
};
export default Player;
