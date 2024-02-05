import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import router from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ socket }: { socket: Socket }) {
  const [code, setCode] = useState<string>("");

  const handleJoin = () => {
    console.log(`sending join signal: ${code}`)
    socket.emit("join_room", code);
  }

  useEffect(() => {
    if (socket) {
      socket.on("join_confirm", () => {
        router.push("/game")
      })
    }
  }, [socket])


  return (
    <main className={`${inter.className}`}>
      <Link href={"/setup"}>New Game</Link>
      <br />
      <form onSubmit={(ev) => {
        ev.preventDefault();
        handleJoin();
      }}>
        <input className="text-black" type="text" id="room" name="room" onChange={(ev) => {
          setCode(ev.currentTarget.value)
        }} />
        <button type="submit">Join room</button>
      </form>
    </main>
  );
}
