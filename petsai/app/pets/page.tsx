"use client";

import React, { useState } from "react";
import PetsSidebar from "../components/PetsSidebar";
import PetImageGenerator from "../components/PetImageGenerator";

export interface Pet {
  id: number;
  pet_name: string;
  type: string;
}

export default function PetsPage() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 overflow-y-auto">
        <PetsSidebar onSelect={setSelectedPet} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        {selectedPet ? (
          <PetImageGenerator selectedPet={selectedPet} />
        ) : (
          <div className="text-gray-600 text-xl">
            Please select a pet from the sidebar.
          </div>
        )}
      </main>
    </div>
  );
}
