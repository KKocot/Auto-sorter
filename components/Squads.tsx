import React from "react";
import { Player } from "./Player";
import type { Player as PlayerType } from "@prisma/client";
import { Squad } from "../types/legion";
//typy
interface SquadsProps {
  squads: Squad[];
}

export const Squads = ({ squads }: SquadsProps) => {
  return (
    <div className="grid grid-cols-3 content-between gap-4 w-full p-4 ">
      {squads.map((squad, squadIndex) => (
        <ul
          className="flex flex-col gap-2 shadow-lg p-2 border border-gray-200"
          key={squadIndex}
        >
          <h2 className=" self-center  border-b-4 border-black w-full">
            Grupa {squadIndex + 1}
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {squad.players.map((player, playerIndex) => (
              <Player data={player} key={playerIndex} />
            ))}
          </div>
        </ul>
      ))}
    </div>
  );
};
