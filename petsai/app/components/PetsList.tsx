"use client";

import React, { useEffect, useState } from "react";
import { getpets } from "@/lib/api";
import PetCard from "./PetCard";

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

export default function PetsList({ onSelect }: { onSelect: (pet: PetType) => void }) {
  const [pets, setPets] = useState<PetType[]>([]);

  useEffect(() => {
    async function fetchPets() {
      try {
        const fetchedPets: Pet[] = await getpets();
        const whiskers: StaticPet = { id: "whiskers-static", pet_name: "Whiskers", type: "cat" };
        setPets([whiskers, ...fetchedPets]); // Place Whiskers at the top
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    }

    fetchPets();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pets.map((pet) => (
        <PetCard key={`pet-${pet.id}`} pet={pet} onClick={() => onSelect(pet)} />
      ))}
    </div>
  );
}
