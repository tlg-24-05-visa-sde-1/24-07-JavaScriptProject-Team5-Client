import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserId } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    axios
      .post("http://localhost:3000/users/login", {
        email,
        password,
      })
      .then((response) => {
        console.log("Login response:", response.data);
        if (response.data.success) {
          console.log("Setting userId:", response.data.userId);
          setUserId(response.data.userId);
          alert("Successfully Logged in");
          navigate("/home");
        } else {
          alert("Wrong username or password");
        }
      })
      .catch((err) => {
        console.log("Login error:", err);
        alert("An error occurred during login");
      });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="************"
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
