import { GameSettings, getRoundString } from "@/pages/setup";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type { RoundOptions } from "@/pages/setup";

export default function Classic({ socket, settings, players }: { socket: Socket, settings: GameSettings, players: string[] }) {
  const [rounds, setRounds] = useState<RoundOptions>(settings.rounds);

  useEffect(() => {

  }, [])

  return (
    <>
      <p className="text-2xl">Classic mode</p>
      <p className="text-2xl">Rounds: {getRoundString(rounds)}</p>
    </>
  )
}