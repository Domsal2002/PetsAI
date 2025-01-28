"use client"; 
import { useEffect, useState } from "react";
import { fetchCurrentUser, UserProfile } from "@/lib/api"; // Adjust path to your api.ts

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("jwt");
      if (!token) {
        // No token => redirect immediately
        window.location.href = "/login";
        return;
      }

      // Call our centralized API function
      const fetchedUser = await fetchCurrentUser(token);

      if (!fetchedUser) {
        // Invalid token or user not found => redirect
        window.location.href = "/login";
        return;
      }

      // If we got valid user data, set state
      setUser(fetchedUser);
      setAuthenticated(true);
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!authenticated) {
    // We already redirected, so you can return null or a small placeholder
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>Email: {user?.email}</p>
      {/* Render other user info or dashboard content */}
    </div>
  );
}
