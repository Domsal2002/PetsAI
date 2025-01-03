import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/users", {
        email,
        username,
        password,
      });
      alert(`User created: ${response.data.email}`);
    } catch (error) {
      if (error.response) {
        // Server responded with a status code other than 2xx
        alert(`Error: ${error.response.data.detail}`);
      } else if (error.request) {
        // Request was made but no response was received
        alert("Error: No response from server. Please try again later.");
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });
      setJwt(response.data.access_token); // Store the JWT in state
      alert("Login successful!");
    } catch (error) {
      alert(`Error: ${error.response.data.detail}`);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/verify", {
        headers: {
          Authorization: `Bearer ${jwt}`, // Send JWT for verification
        },
      });
      alert(response.data.message);
    } catch (error) {
      alert(`Error: ${error.response.data.detail}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>User Registration</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button onClick={handleRegister} style={{ marginRight: "10px" }}>
        Register
      </button>
      <button onClick={handleLogin} style={{ marginRight: "10px" }}>
        Login
      </button>
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default App;
