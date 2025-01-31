"use client";

import React, { useEffect, useState } from "react";
import { getpets } from "@/lib/api";

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

export default function PetsSidebar({ onSelect }: { onSelect: (pet: PetType) => void }) {
  const [pets, setPets] = useState<PetType[]>([]);

  useEffect(() => {
    async function fetchPets() {
      try {
        const fetchedPets: Pet[] = await getpets();
        const whiskers: StaticPet = { id: "whiskers-static", pet_name: "Whiskers", type: "cat" };
        setPets([whiskers, ...fetchedPets]);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    }

    fetchPets();
  }, []);

  return (
    <aside className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Your Pets</h2>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {pets.map((pet) => (
          <li
            key={`pet-${pet.id}`}
            onClick={() => onSelect(pet)}
            className={`cursor-pointer p-3 rounded-lg transition ${
              pet.id === "whiskers-static" ? "border-l-4 border-blue-500 bg-gray-100" : "hover:bg-gray-200"
            }`}
          >
            {pet.pet_name} {pet.type === "cat" ? "🐱" : "🐶"}
          </li>
        ))}
      </ul>
    </aside>
  );
}
