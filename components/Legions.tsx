import React from "react";
import { Squads } from "./Squads";
import type { Player as PlayerType } from "@prisma/client";
import { Legion } from "../types/legion";
//typy
interface LegionProps {
  legions: Legion[];
}
//Wyświetlanie Legionów
export const Legions = ({ legions }: LegionProps) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      {legions?.map((legion, legionIndex) => (
        <div
          className="flex w-full flex-col  border-b border-black"
          key={legionIndex}
        >
          <h1 className=" self-center">Oddzial {legionIndex + 1}</h1>
          <Squads squads={legion.squads} />
        </div>
      ))}
    </div>
  );
};
