import React from "react";
import "./ArtistMedia.css";
const ArtistMedia = ({ albums, onClick }) => {
  return (
    <div className="cover-title-media">
      <img
        className="album-cover-component"
        src={albums.cover}
        onClick={onClick}
      ></img>
      <h1>{albums.title}</h1>
    </div>
  );
};
export default ArtistMedia;
