import React from "react";
import "./ArtistMedia.css";
const ArtistMedia = ({ albums }) => {
  return (
    <div className="cover-title-media">
      <img className="album-cover" src={albums.cover}></img>
      <h1>{albums.title}</h1>
    </div>
  );
};
export default ArtistMedia;
