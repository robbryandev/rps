import Lobby from "@/components/game/lobby";
import Classic from "@/components/game/modes/classic";
import localforage from "localforage";
import { Inter } from "next/font/google";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function Game({ socket }: { socket: Socket }) {
  const [room, setRoom] = useState<string>("")
  let playerId = useRef<string>();
  const [players, setPlayers] = useState<string[]>([])

  const Mode = () => {
    return (
      <Classic socket={socket} players={players} />
    )
  }

  useEffect(() => {
    if (!socket?.connected) {
      router.push("/")
    }
  }, [])

  useEffect(() => {
    if (socket?.connected) {
      console.log("sending room signal")
      socket.emit("room");
      playerId.current = socket.id;

      socket.on("room_data", async (data: any) => {
        console.log("data: " + data)
        const jsonData = JSON.parse(data);
        console.log(`id: ${socket.id}, data: ${data}`);
        setPlayers(jsonData.players)
        if (jsonData.data.length > 0) {
          let newCode = jsonData.data[0]
          if (jsonData.data.length > 1) {
            newCode = jsonData.data[1]
          }
          setRoom(newCode)
          await localforage.setItem("room", newCode)
          console.log(`set room to ${room}`)
        }
      })

      socket.on("player_left", async (code) => {
        setPlayers(players.filter((val) => {
          return val !== code;
        }))
        const roomCache = await localforage.getItem("room")
        if (playerId.current !== roomCache) {
          console.log(`${roomCache} !== ${socket.id}: ${roomCache !== socket.id}`)
          router.push("/")
        }
      })
    }
  }, [room])

  return (
    <main className={`${inter.className}`}>
      <p className="text-4xl">Room: {room}</p>
      {
        players.length === 1 ? (
          <Lobby />
        ) : (
          <Mode />
        )
      }
    </main>
  );
}
