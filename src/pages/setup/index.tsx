import { Just_Another_Hand } from "next/font/google";
import type { Socket } from "socket.io-client";
import Link from "next/link";
import { useState } from "react";
import router from "next/router";
import localforage from "localforage";
import type { ModeOptions } from "@/modes/logic";

const pageFont = Just_Another_Hand({ weight: "400", subsets: ["latin"] });

export type RoundOptions = 3 | 5

export type GameSettings = {
  mode: ModeOptions,
  modeName: string,
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
    "modeName": "Classic",
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
    <main className={`${pageFont.className}`}>
      <p className="text-5xl text-center py-4 sm:py-6">Rock Paper Scissors</p>
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-16 w-2/5 sm:w-1/2 sm:max-w-[500px] mx-auto pt-10 text-xl">
        <div className="border border-dashed border-neutral-400 py-10 text-center bg-white/75">
          <p>Mode:</p>
          <pre className={pageFont.className}><span className="font-semibold">{settings.modeName}</span></pre>
          <select id="modes" className="border-b border-neutral-500 text-xl" onChange={(data) => {
            const newModeOpt = data.currentTarget.value as ModeOptions;
            const modeSelect = data.currentTarget;
            setSettings({
              ...settings,
              mode: newModeOpt,
              modeName: modeSelect.options[modeSelect.selectedIndex].text
            })
          }}>
            <option value="classic">Classic</option>
            <option value="fiveWay">5 Way</option>
            <option value="sevenWay">7 Way</option>
          </select>
        </div>
        <div className="border border-dashed border-neutral-400 py-10 text-center bg-white/75">
          <p>Rounds: </p>
          <pre className={pageFont.className}><span className="font-semibold">{displayRounds}</span></pre>
          <select id="rounds" className="border-b border-neutral-500 text-xl" onChange={(data) => {
            const newRoundOpt = parseInt(data.currentTarget.value) as RoundOptions;
            setSettings({ ...settings, rounds: newRoundOpt })
            setDisplayRounds(getRoundString(newRoundOpt))
          }}>
            <option value="3">{getRoundString(3)}</option>
            <option value="5">{getRoundString(5)}</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-center space-x-24 mt-6 text-2xl">
        <Link className="block border-b border-neutral-500" href={"/"}>Cancel</Link>
        <button className="block border-b border-neutral-500" onClick={startGame}>Start</button>
      </div>
    </main>
  );
}
