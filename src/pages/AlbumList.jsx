import React, { useState } from "react";
import "./AlbumList.css";
import Album from "../components/Album";
import coverSong from "../assets/party.webp";

const AlbumList = () => {
  const [albums, setAlbum] = useState([
    {
      id: 1,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 2,
      title: "hoho",
      artist: "GH",
      cover: coverSong,
      producer: "в21312аы",
      authorLyrics: "ав#а",
      composer: "ф2eq",
      rights: "ла3вы",
      duration: "5 ч 12 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 7,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 8,
      title: "hoho",
      artist: "GH",
      cover: coverSong,
      producer: "в21312аы",
      authorLyrics: "ав#а",
      composer: "ф2eq",
      rights: "ла3вы",
      duration: "5 ч 12 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 9,
      title: "BoyHeart",
      artist: "Kiko",
      cover: coverSong,
      producer: "ваы",
      authorLyrics: "ава",
      composer: "ewrуаф2eq",
      rights: "лавы",
      duration: "4 ч 32 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
    {
      id: 10,
      title: "hoho",
      artist: "GH",
      cover: coverSong,
      producer: "в21312аы",
      authorLyrics: "ав#а",
      composer: "ф2eq",
      rights: "ла3вы",
      duration: "5 ч 12 м",
      url: "https://jfgdhufdg.ru/playlist/244124",
    },
  ]);
  return (
    <div className="album-list">
      <h1 className="album-list__title">Альбомы</h1>
      <div className="palitra-albums">
        {albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};
export default AlbumList;
