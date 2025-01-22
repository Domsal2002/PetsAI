import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/create", {
        email,
        password,
      });

      const jwt = response.data.access_token;
      localStorage.setItem("jwt", jwt); 
      alert(`User created: ${response.data.email}`);

      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register
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
        <div className="mt-6">
          <button
            onClick={handleRegister}
            className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
