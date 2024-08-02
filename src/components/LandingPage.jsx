import React from "react";
import logo from '../assets/added!.gif'
import { NavLink } from "react-router-dom";
import "../App.css";
 
const LandingPage = () => {
  return (
    <div className="landing">
      <header>
        <h1>Welcome</h1>
        <p>Create and manage your own custom basketball teams with ease.</p>
        <img src={logo} alt ='logo' className="logo"/>
        <div class="buttons">
          <NavLink to="/login">
            <button>Login</button>
          </NavLink>
          <NavLink to="/register">
            <button>Sign-up</button>
          </NavLink>
        </div>
      </header>
    </div>
  );
};
 
export default LandingPage;