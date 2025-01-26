"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a valid token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
    } else {
      // Optionally, you could validate the token by making
      // a quick request to an auth-check endpoint in your FastAPI
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!authenticated) {
    return null; // or a message
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the dashboard. You are logged in!</p>
    </div>
  );
}
