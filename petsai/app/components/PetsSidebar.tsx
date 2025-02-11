"use client";

import React, { useEffect, useState } from "react";
import { Pet } from "../pets/page";
import { getPets } from "@/lib/api";

interface PetsSidebarProps {
  onSelect: (pet: Pet) => void;
}

export default function PetsSidebar({ onSelect }: PetsSidebarProps) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    async function fetchPets() {
      try {
        const fetchedPets: Pet[] = await getPets();
        setPets(fetchedPets);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    }
    fetchPets();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">My Pets</h2>
      <ul className="space-y-2">
        {pets.map((pet) => (
          <li
            key={pet.pet_id}
            onClick={() => onSelect(pet)}
            className="cursor-pointer p-2 rounded hover:bg-gray-200"
          >
            {pet.pet_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
