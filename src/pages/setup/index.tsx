import { Inter } from "next/font/google";
import type { Socket } from "socket.io-client";
import Link from "next/link";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type ModeOptions = "classic"
type RoundOptions = 3 | 5

export type GameSettings = {
  mode: ModeOptions,
  rounds: RoundOptions
}

export default function Setup({ socket }: { socket: Socket }) {
  const [settings, setSettings] = useState<GameSettings>({
    "mode": "classic",
    "rounds": 3
  })

  const [displayRounds, setDisplayRounds] = useState<string>("")

  const getRoundString = (roundOpt: RoundOptions | GameSettings) => {
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

  return (
    <main className={`${inter.className}`}>
      <p>Mode: {settings.mode}</p>
      <p>Rounds: {displayRounds}</p>
      <select className="text-black" onChange={(data) => {
        const newRoundOpt = parseInt(data.currentTarget.value) as RoundOptions;
        setSettings({ ...settings, rounds: newRoundOpt })
        setDisplayRounds(getRoundString(newRoundOpt))
      }}>
        <option value="3">{getRoundString(3)}</option>
        <option value="5">{getRoundString(5)}</option>
      </select>
      <br />
      <Link href={"/game"}>Start</Link>
      <br />
      <Link href={"/"}>Cancel</Link>
    </main>
  );
}
