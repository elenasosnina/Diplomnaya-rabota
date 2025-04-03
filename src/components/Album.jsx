import React from "react";
import "./Album.css";
import { useNavigate } from "react-router-dom";

const Album = ({ album }) => {
  const navigate = useNavigate();

  return (
    <div
      className="album-component-cover"
      onClick={() =>
        navigate("/album", {
          state: {
            album: album,
          },
        })
      }
    >
      <img className="card-album-cover" src={album.cover} alt={album.title} />
      <div className="info-album-Oncover">
        <h2>{album.title}</h2>
      </div>
    </div>
  );
};

export default Album;
