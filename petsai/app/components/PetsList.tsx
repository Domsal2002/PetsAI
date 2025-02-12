"use client";

import React, { useEffect, useState } from "react";
import { getPets } from "@/lib/api";
import PetCard from "./PetCard";

interface Pet {
  pet_id: number; // Changed from "id" to "pet_id"
  pet_name: string;
  type: string;
}

type PetType = Pet;

export default function PetsList({ onSelect }: { onSelect: (pet: PetType) => void }) {
  const [pets, setPets] = useState<PetType[]>([]);

  useEffect(() => {
    async function fetchPets() {
      try {
        const fetchedPets: Pet[] = await getPets();
        setPets([...fetchedPets]);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    }

    fetchPets();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pets.map((pet) => (
        <PetCard key={`pet-${pet.pet_id}`} pet={pet} onClick={() => onSelect(pet)} />
      ))}
    </div>
  );
}
