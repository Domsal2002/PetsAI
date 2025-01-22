import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePetPage = () => {
  const [pets, setPets] = useState([]);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const jwt = localStorage.getItem("jwt"); // Retrieve JWT from localStorage

  useEffect(() => {
    // Fetch the user's pets when the component mounts
    const fetchPets = async () => {
      if (!jwt) {
        alert("You need to log in first!");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/pets", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setPets(response.data);
      } catch (error) {
        alert(`Error fetching pets: ${error.response?.data?.detail || error.message}`);
      }
    };

    fetchPets();
  }, [jwt]);

  const handleCreatePet = async () => {
    if (!jwt) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/pets",
        {
          pet_name: petName,
          type: petType,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Pet created successfully: ${response.data.pet_name}`);
      setPets((prevPets) => [...prevPets, response.data]); // Update pet list
      setPetName(""); // Clear the form
      setPetType("");
      setShowModal(false); // Close the modal
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar with pet list */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Pets</h2>
        <ul className="space-y-2">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <li
                key={pet.pet_id}
                className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100"
              >
                <h3 className="text-lg font-bold">{pet.pet_name}</h3>
                <p className="text-sm text-gray-600">Type: {pet.type}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No pets found.</p>
          )}
        </ul>
        <button
          onClick={() => setShowModal(true)}
          className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add a Pet
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to Your Pet Profile Manager
        </h1>
        <p className="text-gray-600">Select a pet to view details or create a new one!</p>
      </div>

      {/* Modal for creating a pet */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create a Pet Profile</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Pet Name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Pet Type (e.g., Dog, Cat)"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePet}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Create Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePetPage;
