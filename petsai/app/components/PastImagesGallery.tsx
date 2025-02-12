"use client";

import React, { useEffect, useState } from "react";
import { fetchExistingImages } from "@/lib/api";

interface ImageData {
  image_id: number;
  prompt: string | null;
  url: string;
}

interface PastImagesGalleryProps {
  pet_id: number;
}

export default function PastImagesGallery({ pet_id }: PastImagesGalleryProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        const imgs = await fetchExistingImages(pet_id);
        setImages(imgs);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, [pet_id]);

  if (loading) {
    return <div className="text-center p-4">Loading past images...</div>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        No images found for this pet.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Past Creations</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div
            key={img.image_id}
            className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={img.url}
              alt={img.prompt || "Generated image"}
              className="w-full h-48 object-cover"
            />
            {img.prompt && (
              <p className="p-2 text-sm text-gray-700">{img.prompt}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
