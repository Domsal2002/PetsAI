"use client";

import React, { useState } from "react";
import { generateImage } from "@/lib/api";

export default function PetImageGenerator({ selectedPet }: { selectedPet: { pet_name: string } }) {
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
    <main className="max-w-2xl bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold">Generate AI Image of {selectedPet.pet_name}</h2>
      <p className="text-gray-500 text-sm mb-4">Enter a description and let AI bring it to life!</p>

      <div className="flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {image && (
        <div className="mt-4">
          <img src={image} alt="Generated AI" className="w-full rounded-md shadow-md" />
        </div>
      )}
    </main>
  );
}
