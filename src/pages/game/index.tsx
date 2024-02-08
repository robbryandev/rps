import Lobby from "@/components/lobby";
import MainGame from "@/components/mainGame";
import localforage from "localforage";
import { Inter } from "next/font/google";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { GameSettings } from "../setup";
import { WinLossMap, getModeOptions, GenericWinCheck } from "@/modes/logic";

const inter = Inter({ subsets: ["latin"] });

export default function Game({ socket }: { socket: Socket }) {
  const [room, setRoom] = useState<string>("")
  let playerId = useRef<string>();
  const [players, setPlayers] = useState<string[]>([])
  const [settings, setSettings] = useState<GameSettings>()

  const Main = () => {
    if (!settings?.mode) {
      return <></>
    }
    const modeOptionData = getModeOptions(settings.mode)!;
    return MainGame<GenericWinCheck>({
      "socket": socket,
      "settings": settings,
      "room": room,
      "winOptions": modeOptionData.winOptions as WinLossMap<GenericWinCheck>,
      "options": modeOptionData.options
    })
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

      socket.on("new_player", async () => {
        if (room === socket.id) {
          console.log("new_player")
          const newSettings = await localforage.getItem("settings")
          socket.emit("game_settings", { settings: newSettings, code: room })
        }
      })

      socket.on("sync_settings", async (settingVal) => {
        console.log("got sync signal")
        await localforage.setItem("settings", settingVal.settings)
        setSettings(JSON.parse(settingVal.settings))
      })

      socket.on("player_left", async (code) => {
        setPlayers(players.filter((val) => {
          return val !== code;
        }))
        const roomCache = await localforage.getItem("room")
        if (playerId.current !== roomCache) {
          console.log(`${roomCache} !== ${socket.id}: ${roomCache !== socket.id}`)
          socket.emit("confirm_leave", code)
        }
      })

      socket.on("return", () => {
        router.push("/")
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
          settings ? (
            <Main />
          ) : null
        )
      }
    </main>
  );
}
