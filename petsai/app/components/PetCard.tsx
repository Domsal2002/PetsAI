"use client";

import React from "react";

interface Pet {
  pet_id: number | string;
  pet_name: string;
  type: string;
}

interface PetCardProps {
  pet: Pet;
  onClick: () => void;
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {pet.pet_name}
      </h3>
      <p className="text-gray-500 capitalize">{pet.type}</p>
    </div>
  );
}
