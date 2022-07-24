import type { InferGetStaticPropsType, NextPage } from "next";
import { Legions } from "../components/Legions";

import prisma from "../lib/prisma";

const Home: NextPage = ({
  legions,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  if (!legions) return <>Brak graczy</>;

  return (
    <div className="flex flex-col h-full">
      <Legions legions={legions} />
    </div>
  );
};
//pobiera do tabelki oddzialow
export const getServerSideProps = async () => {
  const players = await prisma.player.findMany({
    where: {
      NOT: {
        OR: [{ value: 0 }, { value: undefined }], //pomija 0 i undefined
      },
      readyToWar: true,
    },
    orderBy: [
      {
        value: "asc",
      },
    ],
  });

  if (!players) {
    //if dla pustej listy
    return {
      props: {},
    };
  }

  const squads = [];
  const PER_SQUAD = 5;
  //petla ktora dzieli liste z serwera na 5 graczy na grupe
  for (let x = 0; x < Math.ceil(players.length / PER_SQUAD); x++) {
    squads.push({
      players: players.slice(x * PER_SQUAD, x * PER_SQUAD + PER_SQUAD),
    }); // get 5 users per squad
  }

  const legions = [];
  const SQUADS_PER_LEGION = 6;
  //petla ktora dzieli na 5 grup na oddzialy
  for (let x = 0; x < Math.ceil(squads.length / SQUADS_PER_LEGION); x++) {
    legions.push({
      squads: squads.slice(
        x * SQUADS_PER_LEGION,
        x * SQUADS_PER_LEGION + SQUADS_PER_LEGION
      ),
    }); // get 5 squads per legion
  }

  return {
    props: { legions },
  };
};

export default Home;
