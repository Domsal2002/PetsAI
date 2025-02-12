"use client";

import React, { useState } from "react";
import { generateImage, GenerateImageResponse, Pet } from "@/lib/api";
import PastImagesGallery from "./PastImagesGallery";

interface PetImageGeneratorProps {
  selectedPet: Pet;
}

export default function PetImageGenerator({ selectedPet }: PetImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result: GenerateImageResponse = await generateImage(selectedPet.pet_id, prompt);
      setGeneratedImage(result.url);
    } catch (error: any) {
      alert(`Error generating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Generate an Image for {selectedPet.pet_name}
      </h2>
      <p className="text-gray-600 mb-4">
        Describe your vision, and our AI will create an image for you.
      </p>
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          {/* Optional icon inside the input */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 20l9-5-9-5-9 5 9 5z"
              />
            </svg>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Generating...
            </div>
          ) : (
            "Generate"
          )}
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

      {/* Integrated Past Images Gallery */}
      <PastImagesGallery pet_id={selectedPet.pet_id} />
    </div>
  );
}
