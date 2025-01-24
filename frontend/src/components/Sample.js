import React, { useState, useEffect } from "react";
import axios from "axios";

const GenerateImagePage = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        alert("You need to log in first!");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/sample-images", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const fetchedImages = response.data.images;
        setImages(fetchedImages);
        if (fetchedImages.length > 0) {
          setCurrentImage(fetchedImages[0].url);
        }
      } catch (error) {
        alert(`Error fetching images: ${error.message}`);
      }
    };

    fetchImages();
  }, []);

  const handleGenerateImage = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("You need to log in first!");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-image",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newImage = response.data;
      setImages((prevImages) => [newImage, ...prevImages]);
      setCurrentImage(newImage.url);
      setPrompt("");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start gap-4">
          {/* Prompt and Generate Section */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
            <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">
              Generate a New Image
            </h2>
            <textarea
              placeholder="Enter a prompt (e.g., 'A cat in space')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              rows={4}
            />
            <button
              onClick={handleGenerateImage}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>

          {/* Current Image and Past Images */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-4">
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

            {/* Past Images Gallery */}
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
                      alt={image.prompt}
                      className="w-full h-32 object-cover rounded-md shadow-md cursor-pointer transition hover:opacity-80"
                      onClick={() => setCurrentImage(image.url)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow p-3 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AI Image Generator
      </footer>
    </div>
  );
};

export default GenerateImagePage;
