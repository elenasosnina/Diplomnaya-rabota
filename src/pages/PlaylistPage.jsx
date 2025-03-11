import React from "react";
import "./PlaylistPage.css";
import Song from "../components/Songs";
import coverPlaylist from "../assets/login.jpg";
const PlaylistPage = () => {
  return (
    <main className="tracklist-page">
      <div className="card-tracklist">
        <div className="card-info">
          <div className="playlist-cover">
            <img src={coverPlaylist} />
            <div className="listen-counter">204</div>
          </div>
          <div className="playlist-info">
            <p>
              <b>Billie Eilish</b>
            </p>
            <p style={{ fontSize: "18px", marginTop: "30px" }}>4 ч 32 м</p>
            <p style={{ fontSize: "25px", marginTop: "0px" }}>user1</p>
          </div>
        </div>
        <div className="tracklist">
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
          <Song />
        </div>
      </div>
    </main>
  );
};
export default PlaylistPage;
