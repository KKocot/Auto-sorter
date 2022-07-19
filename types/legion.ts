import type { Player } from "@prisma/client";

export type Legion = {
  squads: Squad[];
};
export type Squad = {
  players: Player[];
};

//Defaultowy model gracza po wklejeniu w input
export type PlayerDefault = {
  id: undefined;
  name: string;
  //jesli jest value to jest numerem
  value?: number;
  readyToWar: boolean;
};
