import React from "react";
import "./AlbumList.css";
import Album from "../components/Album";
import { useLocation } from "react-router-dom";

const AlbumList = () => {
  const location = useLocation();
  const { albums } = location.state;
  const handleAlbumClick = (album) => {
    navigate(`/album/${album.AlbumID}`, { state: { album } });
  };
  return (
    <div className="album-list">
      <h1 className="album-list__title"> Альбомы </h1>
      <div className="palitra-albums">
        {albums.map((album) => (
          <Album
            key={album.AlbumID}
            album={album}
            onClick={() => handleAlbumClick(album)}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
