"use client";

import React, { useState } from "react";
import PetsSidebar from "../components/PetsSidebar";
import PetImageGenerator from "../components/PetImageGenerator";
import { Pet } from "@/lib/api";

export default function PetsPage() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <PetsSidebar onSelect={setSelectedPet} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {selectedPet ? (
          <PetImageGenerator selectedPet={selectedPet} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-600">
            <p>Select a pet from the sidebar to generate an image.</p>
          </div>
        )}
      </main>
    </div>
  );
}
