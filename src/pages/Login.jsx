import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [regId, setRegId] = useState("");
  const [regName, setRegName] = useState("");
  const [regRoom, setRegRoom] = useState("");
  const [regFloor, setRegFloor] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const navigate = useNavigate();

  // Login function
  const handleLogin = async () => {
    if (!id || !password) {
      setMessage("Please enter both ID and Password");
      return;
    }
    try {
      const res = await fetch("http://localhost/jru-navigator/session_start.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id,
            name: data.user.name,
            room: data.user.room,
            floor: data.user.floor,
            role: data.user.role,
          })
        );
        navigate(data.user.role === "admin" ? "/admin-dashboard" : "/campus-map");
      } else {
        setMessage(data.message || "Invalid ID or Password");
      }
    } catch (error) {
      setMessage(`Error connecting to server: ${error.message}`);
    }
  };

  // Register function
  const handleRegister = async () => {
    if (!regId || !regName || !regRoom || !regFloor || !regPassword) {
      setMessage("Please fill all registration fields");
      return;
    }
    try {
      const res = await fetch("http://localhost/jru-navigator/session_start.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          id: regId,
          name: regName,
          room: regRoom,
          floor: regFloor,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("Registration successful! You can now login.");
        setShowRegister(false);
        setRegId(""); setRegName(""); setRegRoom(""); setRegFloor(""); setRegPassword("");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage(`Error connecting to server: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">JRU Navigator Login</h2>

        <input
          type="text"
          placeholder="Enter your ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button onClick={handleLogin} className="login-btn">Login</button>

        {message && <p className="login-message">{message}</p>}

        <div className="register-section">
          <p>Don't have an account?</p>
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="register-btn"
          >
            {showRegister ? "Close" : "Register"}
          </button>

          <div className={`register-form ${showRegister ? "active" : ""}`}>
            <h3>Register New Student</h3>
            <input
              type="text"
              placeholder="Student ID"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              className="login-input"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="login-input"
            />
            <input
              type="text"
              placeholder="Room"
              value={regRoom}
              onChange={(e) => setRegRoom(e.target.value)}
              className="login-input"
            />
            <input
              type="number"
              placeholder="Floor"
              value={regFloor}
              onChange={(e) => setRegFloor(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="login-input"
            />
            <button onClick={handleRegister} className="login-btn">
              Submit Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
