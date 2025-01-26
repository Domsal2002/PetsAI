import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/createuser", {
        email,
        password,
      });
      alert(`User created: ${response.data.email}`);
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      alert("Login successful!");
      localStorage.setItem("jwt", response.data.access_token); // Save JWT for reuse
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login / Register
        </h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleRegister}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
