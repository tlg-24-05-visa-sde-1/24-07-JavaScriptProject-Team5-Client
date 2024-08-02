import React, { useState } from "react";
import axios from "axios";
import logo from '../assets/added!.gif'
import { useNavigate } from "react-router-dom";
import "../App.css"; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    axios
      .post("http://localhost:3000/users/register", {
        username,
        email,
        password,
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Successfully registered");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Signup error:", err);
        alert("An error occurred during signup");
      });
  };

  return (
    <div className="signup-container">
      <img src={logo} alt ='logo' className="logo"/>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="************"
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-button">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
