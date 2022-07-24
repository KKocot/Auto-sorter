// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";


import Prisma from "@prisma/client";
import { ObjectID } from "bson";
import prisma from "../../lib/prisma";
import { PlayerDefault } from "../../types/legion";


//wysylanie i pobieranie danych z serwera
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    //jedna z metod REST do aktualizacja: PUT
    case "PUT":
      //Zmienna przyjmuje typy Prisma.Player or PlayerDefault, a nastepnie mapoje przez liste graczy
      const promises = (req.body as (Prisma.Player | PlayerDefault)[]).map(
        (player) => {
          //upsert sprawdza kazdego gracza i aktualizuje jego dane lub go dodaje jesli nie istnieje
          return prisma.player.upsert({
            //jesli player nie ma id zwraca drugi warunek czyli nadaje mu ID
            where: { id: player?.id ?? new ObjectID().toString() },
            //nadpisuje value istniejacego gracza
            update: { value: player.value },
            //tworzy nowego gracza
            create: { name: player.name, value: player.value },
          });
        }
      );
      //Czeka aż zwróci wszystkie wartości czyli wszscy gracze upsertują sie na raz
      const players = await Promise.all(promises);
      //zwraca status 200 czyli pozytywny i wypisuje graczy
      return res.status(200).json(players);
    case "DELETE":
      //wyciagamy ID z body i nadajemy mu typ zeby nie bly "any"
      const { id } = req.body as { id: string };
      //usuwa gracza z danym id
      await prisma.player.delete({
        where: { id },
      });

      return res.status(200).end();
    //wszystko inne zwraca 404
    default:
      return res.status(404).end();
  }
}
