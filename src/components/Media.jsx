import React from "react";
import "./Media.css";
import editSign from "../assets/edit.png";

const Media = ({ item, type, onClick, showEditIcon, onClickEdit }) => {
  if (type === "artist") {
    return (
      <div className="media-container media-container--artist">
        <img
          className="media-image media-image--artist"
          src={item.photo}
          alt={item.nickname}
          onClick={onClick}
        />
        <h1 className="media-title media-title--artist">{item.nickname}</h1>
      </div>
    );
  } else if (type === "album") {
    return (
      <div className="media-container media-container--album">
        <div className="media-wrapper" onClick={onClick}>
          <img
            className="media-image media-image--album"
            src={item.cover}
            alt={item.title}
          />
          <div className="media-overlay" />
          {showEditIcon && (
            <img
              className="media-edit-icon"
              src={editSign}
              alt="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onClickEdit();
              }}
            />
          )}
        </div>
        <h1 className="media-title media-title--album">{item.title}</h1>
      </div>
    );
  } else {
    return null;
  }
};

export default Media;
