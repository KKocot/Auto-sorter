// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import Prisma from "@prisma/client";
import { ObjectID } from "bson";
import prisma from "../../../lib/prisma";
import type { Player as PlayerType } from "@prisma/client";

//wysylanie i pobieranie danych z serwera
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "DELETE":
      //wyciagamy ID z body i nadajemy mu typ zeby nie bly "any"
      const { id: deletedId } = req.query as { id: string };
      //usuwa gracza z danym id
      await prisma.player.delete({
        where: { id: deletedId },
      });

      return res.status(200).end();

    case "PUT":
      //wyciagamy ID z body i nadajemy mu typ zeby nie bly "any"
      const { id: queryId } = req.query as { id: string };
      const { id, ...updatedData } = req.body as PlayerType;
      //usuwa gracza z danym id
      await prisma.player.update({
        where: { id: queryId },
        data: { ...updatedData },
      });

      return res.status(200).end();
    //wszystko inne zwraca 404
    default:
      return res.status(404).end();
  }
}
