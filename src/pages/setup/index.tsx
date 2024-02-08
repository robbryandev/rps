import { Inter } from "next/font/google";
import type { Socket } from "socket.io-client";
import Link from "next/link";
import { useState } from "react";
import router from "next/router";
import localforage from "localforage";

const inter = Inter({ subsets: ["latin"] });

export type ModeOptions = "classic"
export type RoundOptions = 3 | 5

export type GameSettings = {
  mode: ModeOptions,
  rounds: RoundOptions
}

export function getRoundString(roundOpt: RoundOptions | GameSettings) {
  let round = 3;
  if (typeof roundOpt === "number") {
    round = roundOpt;
  } else {
    round = roundOpt.rounds;
  }
  switch (round) {
    case 3:
      return "best 2 out of 3"
    case 5:
      return "best 3 out of 5"
    default:
      return ""
  }
}

export default function Setup({ socket }: { socket: Socket }) {
  const [settings, setSettings] = useState<GameSettings>({
    "mode": "classic",
    "rounds": 3
  })
  const [displayRounds, setDisplayRounds] = useState<string>(getRoundString(3))

  const startGame = () => {
    localforage.setItem("settings", JSON.stringify(settings)).then(() => {
      router.push("/game")
    }).catch((err: any) => {
      console.log(err)
    })
  }

  return (
    <main className={`${inter.className}`}>
      <p className="text-3xl text-center py-4 sm:py-6">Rock Paper Scissors</p>
      <div className="grid grid-cols-2 gap-24 w-2/5 mx-auto pt-10">
        <div className="border border-neutral-400 py-10">
          <p className="text-center">Mode: <span className="font-semibold">{settings.mode}</span></p>
        </div>
        <div className="border border-neutral-400 py-10 text-center">
          <p>Rounds: <span className="font-semibold">{displayRounds}</span></p>
          <select className="border-b border-neutral-500" onChange={(data) => {
            const newRoundOpt = parseInt(data.currentTarget.value) as RoundOptions;
            setSettings({ ...settings, rounds: newRoundOpt })
            setDisplayRounds(getRoundString(newRoundOpt))
          }}>
            <option value="3">{getRoundString(3)}</option>
            <option value="5">{getRoundString(5)}</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-center space-x-24 mt-6">
        <Link className="block border-b border-neutral-500" href={"/"}>Cancel</Link>
        <button className="block border-b border-neutral-500" onClick={startGame}>Start</button>
      </div>
    </main>
  );
}
