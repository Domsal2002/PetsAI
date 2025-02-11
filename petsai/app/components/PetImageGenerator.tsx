"use client";

import React, { useState } from "react";
import { generateImage, GenerateImageResponse, Pet } from "@/lib/api";

interface PetImageGeneratorProps {
  selectedPet: Pet;
}

export default function PetImageGenerator({ selectedPet }: PetImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // For now, we use a default model id (hidden from the user)
  const DEFAULT_MODEL_ID = 24;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result: GenerateImageResponse = await generateImage(selectedPet.pet_id, DEFAULT_MODEL_ID, prompt);
      setGeneratedImage(result.url);
    } catch (error: any) {
      alert(`Error generating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate an Image for {selectedPet.pet_name}</h2>
      <p className="text-gray-600 mb-4">
        Describe your vision, and our AI will create an image for you.
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
          <img src={generatedImage} alt="Generated AI" className="w-full rounded shadow-md" />
        </div>
      )}
    </div>
  );
}
