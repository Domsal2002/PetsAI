"use client";

import React, { useState } from "react";
import { Pet } from "../pets/page";
import { generateImage } from "@/lib/api";

interface PetImageGeneratorProps {
  selectedPet: Pet;
}

export default function PetImageGenerator({ selectedPet }: PetImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // For now, we use a default model id. Later, you could allow a user to choose.
  const DEFAULT_MODEL_ID = 24;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // generateImage is expected to call your dynamic image generation endpoint
      // using the selected pet's ID, the default model id, and the prompt.
      const result = await generateImage(selectedPet.pet_id, DEFAULT_MODEL_ID, prompt);
      setGeneratedImage(result.url);
    } catch (error: any) {
      alert(`Error generating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">
        Generate an Image for {selectedPet.pet_name}
      </h2>
      <p className="text-gray-600 mb-4">
        Describe what you'd like to see, and our AI will create an image.
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated AI"
            className="w-full rounded shadow-md"
          />
        </div>
      )}
    </div>
  );
}
