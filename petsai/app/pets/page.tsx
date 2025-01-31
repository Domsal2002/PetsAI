"use client";

import React, { useState } from "react";
import PetsList from "../components/PetsList";
import WhiskersGenerator from "../components/WhiskersGenerator";

interface Pet {
  id: number;
  pet_name: string;
  type: string;
}

interface StaticPet {
  id: "whiskers-static";
  pet_name: string;
  type: "cat";
}

type PetType = Pet | StaticPet;

export default function PetsPage() {
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="bg-white shadow-md p-5 rounded-lg mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Your Pets</h1>
      </header>

      <div className="max-w-5xl mx-auto space-y-6">
        {!selectedPet ? (
          <PetsList onSelect={setSelectedPet} />
        ) : (
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <button
              onClick={() => setSelectedPet(null)}
              className="text-blue-600 hover:underline mb-4"
            >
              ← Back to Pets
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{selectedPet.pet_name}</h2>
            <p className="text-gray-500 capitalize">Type: {selectedPet.type}</p>
            {selectedPet.id === "whiskers-static" && <WhiskersGenerator />}
          </div>
        )}
      </div>
    </div>
  );
}
