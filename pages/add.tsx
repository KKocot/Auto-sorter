import type { InferGetStaticPropsType, NextPage } from "next";
import type { Player as PlayerType } from "@prisma/client";
import { PlayerDefault } from "../types/legion";
import React, { useState } from "react";
import prisma from "../lib/prisma";
import { ThumbUpIcon, ThumbDownIcon } from "@heroicons/react/solid";

//funkcja ktora sprawdza czy jest gracze istnieja
export const getStaticProps = async () => {
  const players = await prisma.player.findMany();
  if (!players) {
    return {
      props: {},
    };
  }
  return {
    props: { players },
  };
};

//strona do dodawania graczy i ma argument liste graczy z serwera
const Add: NextPage = ({
  players,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [dirty, setDirty] = useState(false);
  const [input, setinput] = useState("");
  const [playerListBefore, setPlayerListBefore] = useState<
    (PlayerDefault | PlayerType)[]
  >(players ?? []);
  const [playerList, setPlayerList] = useState<(PlayerDefault | PlayerType)[]>(
    players ?? []
  );
  //dodawanie przez textarea
  const addPlayers = () => {
    //łączy tablice ktorą dostaliśmy z bazy i tą którą wklejamy
    setPlayerList((prev) => {
      const tmp = [...prev];
      const newPlayers = input.split("\n");
      for (let name of newPlayers) {
        if (!name || !name.trim()) {
          continue;
        }
        const index = prev.findIndex((p) => p.name === name);

        if (index !== -1) {
          tmp[index] = { ...tmp[index], readyToWar: true };
          continue;
        }
        tmp.push({ id: undefined, name: name, readyToWar: true });
      }
      return tmp;
    });
    setDirty(true);
    setinput("");
  };
  const resetStatus = () => {
    setPlayerList((prev) => prev.map((el) => ({ ...el, readyToWar: false })));
    setDirty(true);
  };

  const removePlayer = (name: string) => {
    const player = playerList.find((player) => player.name === name); //szuka pojedynczego gracza z listy po "name"
    //jesli player ma ID to go jednego usuwa z bazy danych
    if (player?.id) {
      fetch(`/api/players/${player.id}`, {
        method: "DELETE",
      }).then(() => {
        setPlayerList((prev) => prev.filter((playerEl) => playerEl !== player));
        setPlayerListBefore((prev) =>
          prev.filter((playerEl) => playerEl !== player)
        );
      });
    } else {
      //jesli tego gracza nie ma to i tak go wywala i przeladowuje liste
      setPlayerList((prev) => prev.filter((playerEl) => playerEl !== player));
    }
  };
  //aktualizuje/tworzy graczy na serwerze po kliknieciu "aktualizju graczy"
  const updatePlayers = () => {
    fetch("/api/players", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(playerList),
    })
      .then((res) => res.json())
      .then((players) => {
        setPlayerList(players), setDirty(false);
        setPlayerListBefore(players);
      });
  };
  const resetData = () => {
    setPlayerList(playerListBefore);
    setDirty(false);
  };

  const setValue = (value: string, name: string) => {
    setPlayerList((prev) => {
      return prev.map((player) => {
        if (player.name !== name) return player;
        return { ...player, value: Number(value) };
      });
    });
    setDirty(true);
  };
  const toggleReady = (name: string) => {
    setPlayerList((prev) => {
      return prev.map((player) => {
        if (player.name !== name) return player;
        return { ...player, readyToWar: !player.readyToWar };
      });
    });
    setDirty(true);
  };

  return (
    <div className="p-4 grid grid-cols-4  gap-1">
      <div className="flex flex-col">
        <button
          className="p-1 bg-blue-500 hover:bg-blue-400 text-white"
          onClick={addPlayers}
        >
          dodaj graczy
        </button>
        <textarea
          placeholder="Add players"
          className=" flex-grow p-2  placeholder-black border"
          value={input}
          onChange={(e) => setinput(e.target.value)}
        />
      </div>
      <div className="flex flex-col col-span-3 ">
        <div className="flex gap-1">
          <button
            className="p-1 bg-blue-500 hover:bg-blue-400 text-white"
            onClick={resetStatus}
          >
            wyczysc status wszystkim
          </button>
          {dirty && (
            <>
              <button
                className="p-1 bg-blue-500 hover:bg-blue-400 text-white"
                onClick={resetData}
              >
                resetuj dane
              </button>
              <button
                className="p-1 bg-blue-500 hover:bg-blue-400 text-white"
                onClick={updatePlayers}
              >
                aktualizuj graczy
              </button>
            </>
          )}
        </div>
        <div className="divide-y flex-grow grid grid-cols-2  ">
          {playerList &&
            playerList.map((player) => (
              <div key={player.name} className="divide-x flex gap-1 p-1 ">
                <button
                  className="text-red-500 font-bold"
                  onClick={() => removePlayer(player.name)}
                >
                  X
                </button>
                <span className="w-60 flex">
                  {player.name}

                  <button onClick={() => toggleReady(player.name)}>
                    {player.readyToWar ? (
                      <ThumbUpIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ThumbDownIcon className="w-5 h-5 text-red-500" />
                    )}
                  </button>
                </span>
                <div className="flex gap-2 ">
                  <select
                    onChange={(e) => setValue(e.target.value, player.name)}
                    value={player.value ?? ""}
                  >
                    <option value="" disabled>
                      set value
                    </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Add;
