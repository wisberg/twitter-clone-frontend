import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

import chatLogo from "../assets/chatPic.png";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const menuBar = user ? (
    <Menu inverted pointing secondary size="massive" id="navbar">
      <Menu.Item>
        <img alt="Logo" src={chatLogo} />
      </Menu.Item>
      <Menu.Item
        active={activeItem === "home"}
        name={user.username}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Item
        name="profile"
        active={activeItem === "profile"}
        onClick={handleItemClick}
        as={Link}
        to="/profile"
      />
      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} as={Link} to="/login" />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu inverted pointing secondary size="massive" color="white" id="navbar">
      <Menu.Item>
        <img alt="Logo" src={chatLogo} />
      </Menu.Item>
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}
