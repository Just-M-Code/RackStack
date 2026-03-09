import React from "react";
import Wrapper from "../sections/Wrapper";
import avatarImage from "../assets/Magnus.jpg";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

function About() {
  return (
    <div className="profile">
      <img src={avatarImage} alt="avatar" className="profile-image" />
      <h1 className="profile-text">Hi I am Magnus Engberg</h1>
      <h2 className="profile-text">The creator of this awesome pokedex</h2>
      <h4 className="profile-text">
        This pokedex is created for all fans to enjoy the complete Pokemon
        collection rendered by{" "}
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noreferrer"
          className="profile-api-link"
        >
          PokeAPI
        </a>
      </h4>
      <div className="profile-links">
        <a
          href="https://github.com/Just-M-Code"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.youtube.com/channel/UCiVxJHSi9yrC84wQN6CyWAQ"
          target="_blank"
          rel="noreferrer"
        >
          <FaYoutube />
        </a>
        <a
          href="https://www.linkedin.com/in/magnus-engberg-7729b7a2/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
}

export default Wrapper(About);
