import React from "react";
import genreImage from "../assets/party.webp";
import "./Genres.css";
const Genres = () => {
  return (
    <div className="genre-card">
      <img className="image-genre" src={genreImage}></img>
      <h4 style={{ marginTop: "10px" }}>Название</h4>
    </div>
  );
};
export default Genres;
