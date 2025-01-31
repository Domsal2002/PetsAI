"use client";

import React, { useState } from "react";
import { generateImage } from "@/lib/api";

export default function WhiskersGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateImage(prompt);
      setImage(result.url);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-md">
      <h2 className="text-lg font-semibold">Generate Image for Whiskers</h2>
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 mt-2"
        placeholder="Enter a prompt for Whiskers..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-700 transition"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {image && <img src={image} alt="Generated Whiskers" className="mt-4 rounded-md shadow-md" />}
    </div>
  );
}
