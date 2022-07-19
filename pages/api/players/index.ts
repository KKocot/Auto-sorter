// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import Prisma from "@prisma/client";
import { ObjectID } from "bson";
import prisma from "../../../lib/prisma";

//Defaultowy model gracza po wklejeniu w input
type PlayerDefault = {
  id: undefined;
  name: string;
  //jesli jest value to jest numerem
  value?: number;
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  //Zmienna przyjmuje typy Prisma.Player or PlayerDefault, a nastepnie mapoje przez liste graczy
  const promises = (req.body as (Prisma.Player | PlayerDefault)[]).map(
    //wyciagamy id zeby nie nadpisac
    ({ id, ...player }) => {
      //upsert sprawdza kazdego gracza i aktualizuje jego dane lub go dodaje jesli nie istnieje
      return prisma.player.upsert({
        //jesli nie ma gracza o podanym name zwraca drugi warunek czyli tworzy go
        where: { name: player?.name ?? "" },
        //nadpisuje value istniejacego gracza
        update: player,
        //tworzy nowego gracza
        create: player,
      });
    }
  );
  //Czeka aż zwróci wszystkie wartości czyli wszscy gracze upsertują sie na raz
  const players = await Promise.all(promises);
  //zwraca status 200 czyli pozytywny i wypisuje graczy
  return res.status(200).json(players);
};

//wysylanie i pobieranie danych z serwera
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    //jedna z metod REST do aktualizacja: PUT
    case "PUT":
      return PUT(req, res);
    //wszystko inne zwraca 404
    default:
      return res.status(404).end();
  }
}
