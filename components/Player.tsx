import React, { useState } from "react";
import type { Player as PlayerType } from "@prisma/client";
import { SaveIcon } from "@heroicons/react/solid";

//typy
interface PlayerProps {
  data: PlayerType;
}
export const Player = ({ data }: PlayerProps) => {
  //Taski dla gracza
  const [item, setItem] = useState("");
  const [dirty, setDirty] = useState(false);
  //lista tasków
  const [list, setList] = useState<string[]>(data.notes ?? []);

  const addItem = () => {
    if (!item) {
      alert("Enter an item.");
      return;
    }
    const items = item;

    setList((oldList) => [...oldList, items]);
    setItem("");
    setDirty(true);
  };
  //Delete task filtruje liste po kazdym elemencie i zwraca liste bez elementu z argumentu
  const deleteItem = (item: string) => {
    setList(list.filter((e) => e !== item));
    setDirty(true);
  };

  const updatePlayer = () => {
    fetch(`/api/players/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes: list }),
    }).then(() => {
      setDirty(false);
    });
  };
  //wyswietla liste taskow
  const details = list.map((e) => (
    <div key={e} className="flex gap-1 p-1 text-sm text-gray-500">
      <span className="">{e}</span>
      <div className="divide-y-2" />
      <button className="text-red-500 font-bold" onClick={() => deleteItem(e)}>
        X
      </button>
    </div>
  ));
  //wyswitla graczy
  return (
    <ol className="flex-col items-center p-2 border-b-2 border-neutral-400 shadow rounded first:border-amber-500">
      <div className="flex w-full p-1">
        <span className="font-semibold self-center">{data.name}</span>{" "}
        <input
          placeholder="+"
          className="w-24 mx-1 p-1 flex-grow rounded-l "
          value={item}
          onChange={(e) => setItem(e.target.value)}
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem();
            }
          }}
        />
      </div>
      <div className="flex  divide-x divide-gray-700 gap-2">
        {dirty && (
          <button onClick={() => updatePlayer()}>
            <SaveIcon className="w-5 h-5 self-center text-green-500" />
          </button>
        )}
        {details}
      </div>
    </ol>
  );
};
