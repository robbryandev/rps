import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import router from "next/router";
import localforage from "localforage";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ socket }: { socket: Socket }) {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleJoin = () => {
    console.log(`sending join signal: ${code}`)
    socket.emit("join_room", code);
  }

  useEffect(() => {
    if (socket) {
      socket.on("join_confirm", () => {
        localforage.setItem("room", code).then(() => {
          router.push("/game")
        }).catch((err: any) => {
          console.log(err)
        })
      })
      socket.on("room_full", () => {
        setError("Room already full");
        setTimeout(() => {
          setError("");
        }, 3_000)
      })
      socket.on("room_not_found", () => {
        setError("Room not found");
        setTimeout(() => {
          setError("");
        }, 3_000)
      })
    }
  }, [socket])


  return (
    <main className={`${inter.className}`}>
      <p className="text-3xl text-center py-4 sm:py-6">Rock Paper Scissors</p>
      <div className="flex flex-wrap sm:flex-row justify-center space-y-12 sm:space-y-0 sm:space-x-48 pt-10">
        <div className="px-24 py-16 border border-neutral-400">
          <Link className="border-b border-neutral-500 py-1" href={"/setup"}>New Game</Link>
        </div>
        <div className="px-12 py-16 border border-neutral-400">
          <div id="error">
            <p>{error}</p>
          </div>
          <form onSubmit={(ev) => {
            ev.preventDefault();
            handleJoin();
          }}>
            <input className="border-b border-b-neutral-500 block" placeholder="room code" type="text" id="room" name="room" onChange={(ev) => {
              setCode(ev.currentTarget.value)
            }} />
            <button className="mt-4 border-b border-neutral-500 py-1" type="submit">Join game</button>
          </form>
        </div>
      </div>
    </main >
  );
}
