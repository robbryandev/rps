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
      <Link href={"/setup"}>New Game</Link>
      <br />
      <div id="error">
        <p>{error}</p>
      </div>
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
