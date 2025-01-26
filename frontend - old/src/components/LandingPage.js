import React from "react";

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white text-center py-20">
        <h2 className="text-4xl font-bold mb-4">Bring Your Pet's Photos to Life with AI</h2>
        <p className="text-lg mb-6">
          Create stunning, AI-generated images of your pets in imaginative scenarios.
          Join the future of pet photography!
        </p>
        <a
          href="/login"
          className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700"
        >
          Get Started
        </a>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">AI Model Fine-Tuning</h3>
            <p>Upload images of your pet and let our AI fine-tune a model just for you.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
            <p>Store your pet's images securely with AWS S3.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
            <p>Download and share AI-generated images directly on social media.</p>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Before & After AI Generation</h2>
          <p className="mb-8">
            See the transformation of pet photos with our AI model.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Original Photos</h3>
              <div className="flex space-x-4">
                <img
                  src="/path/to/original1.jpg"
                  alt="Original Pet Photo 1"
                  className="w-1/3 rounded-lg shadow"
                />
                <img
                  src="/path/to/original2.jpg"
                  alt="Original Pet Photo 2"
                  className="w-1/3 rounded-lg shadow"
                />
                <img
                  src="/path/to/original3.jpg"
                  alt="Original Pet Photo 3"
                  className="w-1/3 rounded-lg shadow"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">AI-Generated Photos</h3>
              <div className="flex space-x-4">
                <img
                  src="/path/to/generated1.jpg"
                  alt="AI Generated Pet Photo 1"
                  className="w-1/3 rounded-lg shadow"
                />
                <img
                  src="/path/to/generated2.jpg"
                  alt="AI Generated Pet Photo 2"
                  className="w-1/3 rounded-lg shadow"
                />
                <img
                  src="/path/to/generated3.jpg"
                  alt="AI Generated Pet Photo 3"
                  className="w-1/3 rounded-lg shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
