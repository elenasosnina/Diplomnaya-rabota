import React from "react";
import "./Media.css";

const Media = ({ item, type, onClick }) => {
  if (type === "artist") {
    return (
      <div className="cover-artist">
        <img
          className="artist-cover-component"
          src={item.photo}
          alt={item.nickname}
          onClick={onClick}
        />
        <h1>{item.nickname}</h1>
      </div>
    );
  } else if (type === "album") {
    return (
      <div className="cover-title-media">
        <img
          className="album-cover-component"
          src={item.cover}
          alt={item.title}
          onClick={onClick}
        />
        <h1>{item.title}</h1>
      </div>
    );
  } else {
    return null;
  }
};

export default Media;
