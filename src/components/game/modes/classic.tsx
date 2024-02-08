import { useEffect } from "react";
import type { Socket } from "socket.io-client";

export default function Classic({ socket, players }: { socket: Socket, players: string[] }) {
  useEffect(() => {

  }, [])

  return (
    <>
      <p className="text-2xl">Classic mode</p>
    </>
  )
}