"use client";

import React from "react";

interface PetCardProps {
  pet: { id: number | "whiskers-static"; pet_name: string; type: string };
  onClick: () => void;
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  const isWhiskers = pet.id === "whiskers-static";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition ${
        isWhiskers ? "border-2 border-blue-500 scale-105" : ""
      }`}
    >
      <h3 className={`text-lg font-semibold ${isWhiskers ? "text-blue-600" : "text-gray-800"}`}>
        {pet.pet_name}
      </h3>
      <p className="text-gray-500 capitalize">{pet.type}</p>
      {isWhiskers && <p className="mt-2 text-xs text-blue-500">Available to all users</p>}
    </div>
  );
}
