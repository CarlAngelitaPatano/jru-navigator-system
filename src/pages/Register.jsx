import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reuse the same login styles for consistency

function Register() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [floor, setFloor] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!id || !password || !name || !room || !floor) {
      setMessage("❌ Please fill out all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost/jru-navigator/session_start.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password, name, room, floor, action: "register" }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "❌ Registration failed");
      }
    } catch (error) {
      setMessage(`❌ Error connecting to server: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Student Registration</h2>

        <input
          type="text"
          placeholder="Student ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input"
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="login-input"
        />
        <input
          type="number"
          placeholder="Floor"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="login-input"
        />

        <button onClick={handleRegister} className="login-btn">Register</button>

        {message && <p className="login-message">{message}</p>}

        <div className="register-section">
          <p>Already have an account?</p>
          <button onClick={() => navigate("/login")} className="register-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
