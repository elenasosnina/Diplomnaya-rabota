import React from "react";
import "./AlbumList.css";
import Album from "../components/Album";
import { useLocation } from "react-router-dom";

const AlbumList = () => {
  const location = useLocation();
  const { albums, name } = location.state;

  return (
    <div className="album-list">
      <h1 className="album-list__title"> {name} </h1>
      <div className="palitra-albums">
        {albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
