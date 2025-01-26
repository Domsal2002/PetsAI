"use client";
import React, { FormEvent, useState } from "react";
import { loginUser } from "@/lib/api";  // Adjust this import if your path differs

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Call our helper function from lib/api.ts
      const data = await loginUser(email, password);

      // data should contain { id_token, access_token, token_type }
      console.log("Login successful:", data);

      // Store tokens in localStorage (simple approach)
      localStorage.setItem("jwt", data.access_token);

      // Optionally redirect to a protected route (like a Dashboard)
      window.location.href = "/dashboard";
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {errorMsg && (
          <div className="p-2 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
