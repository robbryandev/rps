import localforage from "localforage";
import { Inter } from "next/font/google";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function Game({ socket }: { socket: Socket }) {
  const [room, setRoom] = useState<string>(socket?.id! ?? "")
  const [players, setPlayers] = useState<string[]>([])
  useEffect(() => {
    if (!socket?.connected) {
      router.push("/")
    }
  }, [])

  useEffect(() => {
    if (socket?.connected) {
      console.log("sending room signal")
      socket.emit("room");
      socket.on("disconnect", () => {
        localforage.getItem("room").then((room) => {
          socket.emit("leave", room)
        }).catch((err) => {
          console.log(err)
        })
      })
      socket.on("room_data", (data: any) => {
        console.log("data: " + data)
        const jsonData = JSON.parse(data);
        console.log(`id: ${socket.id}, data: ${data}`);
        setPlayers(jsonData.players)
        if (jsonData.data.length > 1) {
          setRoom(jsonData.data[1])
        }
      })
    }
  }, [room])

  return (
    <main className={`${inter.className}`}>
      <p className="text-4xl">Room: {room}</p>
      <p className="text-4xl">Players: {players.length}</p>
    </main>
  );
}
