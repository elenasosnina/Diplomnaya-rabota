import React from "react";
import "./MenuSong.css";

const MenuSong = ({ options }) => {
  return (
    <div className="menu-dropdown">
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={option.action}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MenuSong;
