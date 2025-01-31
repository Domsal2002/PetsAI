"use client";

import React, { useState } from "react";
import PetsSidebar from "../components/PetsSidebar";
import PetImageGenerator from "../components/PetImageGenerator";

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
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar - Takes space but remains scrollable */}
      <div className="w-64 bg-white shadow-md p-4 h-full overflow-y-auto">
        <PetsSidebar onSelect={setSelectedPet} />
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 p-6 flex items-center justify-center">
        {selectedPet ? (
          <PetImageGenerator selectedPet={selectedPet} />
        ) : (
          <div className="text-gray-500 text-lg font-medium">
            Select a pet to start generating images.
          </div>
        )}
      </div>
    </div>
  );
}
