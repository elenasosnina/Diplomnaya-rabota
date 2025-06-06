import React from "react";
import "./Media.css";
import editSign from "../assets/edit.png";
import deleteSign from "../assets/deletePlaylist.png";

const Media = ({ item, type, onClick, showEditIcon, onClickEdit }) => {
  const onClickDelete = async (e) => {
    e.stopPropagation();
    try {
      const url = `http://localhost:5000/api/user/playlists/${item.PlaylistID}`;
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.log("Ошибка" + response.status);
      }
    } catch (e) {
      console.error("Ошибка при удалении плейлиста:", e);
    }
  };

  if (type === "artist") {
    return (
      <div className="media-container media-container--artist">
        <img
          className="media-image media-image--artist"
          src={item.PhotoProfile}
          alt={item.Nickname}
          onClick={onClick}
        />
        <h1 className="media-title media-title--artist">{item.Nickname}</h1>
      </div>
    );
  }

  if (type === "album") {
    return (
      <div className="media-container media-container--album">
        <div className="media-wrapper" onClick={onClick}>
          <img
            className="media-image media-image--album"
            src={item.PhotoCover}
            alt={item.Title}
          />
          <div className="media-overlay" />
          {showEditIcon && (
            <>
              <img
                className="media-edit-icon"
                src={editSign}
                alt="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickEdit();
                }}
              />
              <img
                className="media-delete-icon"
                src={deleteSign}
                alt="Delete"
                onClick={onClickDelete}
              />
            </>
          )}
        </div>
        <h1 className="media-title media-title--album">{item.Title}</h1>
      </div>
    );
  }

  return null;
};

export default Media;
