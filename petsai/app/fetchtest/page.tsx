"use client";

// pages/test-pet0.tsx
import { useEffect, useState } from "react";
import { fetchExistingImages } from "../../lib/api";

interface ImageData {
  image_id: number;
  prompt: string | null;
  url: string; // presigned URL
}

export default function TestPet0Page() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hard-code petId to 0
    setLoading(true);

    fetchExistingImages(0)
      .then((data) => {
        // Adjust if your backend returns e.g. { images: [...] }
        setImages(
          data.map((img: any) => ({
            image_id: img.image_id,
            prompt: img.prompt,
            url: img.url,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Images for Pet 0 (Test Page)</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {images.map((img) => (
          <div
            key={img.image_id}
            style={{ border: "1px solid #ccc", padding: 8 }}
          >
            {img.prompt && <p>Prompt: {img.prompt}</p>}
            <img
              src={img.url}
              alt={`Pet image ${img.image_id}`}
              style={{ width: 200, height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
