"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { generateImage, fetchCurrentUser, UserProfile } from "@/lib/api";
import { useRouter } from "next/navigation"; // redirect unauthorized users

export default function SamplePage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false); // ✅ Ensures no flickering
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const fetchedUser = await fetchCurrentUser();
      if (!fetchedUser) {
        router.push("/login"); // ✅ Redirect if not authenticated
        return;
      }
      setUser(fetchedUser);
      setAuthChecked(true);
    }
    checkAuth();
  }, []);

  if (!authChecked) {
    return <div className="p-4 text-center">Loading...</div>; // ✅ Prevents UI flickering
  }

  const trainingImages = [
    { src: "/Whiskers1.jpg", alt: "Whiskers 1" },
    { src: "/Whiskers2.jpg", alt: "Whiskers 2" }
  ];

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const newImage = await generateImage(prompt);
      setImages((prev) => [newImage, ...prev]);
      setCurrentImage(newImage.url);
      setPrompt("");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-gray-800 max-w-7xl mx-auto">
          AI Pet Image Generator
        </h1>
      </header>

      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <section className="mb-6 bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Training Images</h2>
            <p className="text-sm text-gray-600 mb-4">
              Below are some sample training images used to fine-tune the model for your pet.
            </p>
            <div className="flex gap-4 overflow-x-auto">
              {trainingImages.map((img, i) => (
                <div key={i} className="relative min-w-[150px] h-[100px]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover rounded shadow"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 bg-white rounded shadow p-4">
              <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">
                Generate a New Image
              </h2>
              <textarea
                placeholder="Enter a prompt (e.g., 'My dog wearing sunglasses')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                rows={4}
              />
              <button
                onClick={handleGenerateImage}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Image"}
              </button>
            </div>

            <div className="md:w-2/3 bg-white rounded shadow p-4">
              <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">
                Current Image
              </h2>
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Generated AI"
                  className="w-full h-auto object-cover rounded-md shadow-md mb-3"
                />
              ) : (
                <p className="text-gray-600 text-center mb-3">
                  No images yet. Generate one!
                </p>
              )}

              {images.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">
                    Past Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.prompt || `Generated Image ${index}`}
                        className="w-full h-32 object-cover rounded-md shadow-md cursor-pointer transition hover:opacity-80"
                        onClick={() => setCurrentImage(image.url)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white shadow p-3 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AI Image Generator
      </footer>
    </div>
  );
}
