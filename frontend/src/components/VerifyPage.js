import React from "react";
import axios from "axios";

const VerifyPage = () => {
  const handleVerify = async () => {
    const jwt = localStorage.getItem("jwt"); // Retrieve JWT from localStorage
    if (!jwt) {
      alert("No token found. Please log in first.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/verify", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      alert(response.data.message);
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Token Verification</h1>
      <button onClick={handleVerify}>Verify Token</button>
    </div>
  );
};

export default VerifyPage;
