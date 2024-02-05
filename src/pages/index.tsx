import { Inter } from "next/font/google";
import { Socket, io } from "socket.io-client";
import { v4 } from "uuid";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [socket, setSocket] = useState<Socket>()
  const [init, setInit] = useState<boolean>(false)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      const socket = io()
      setSocket(socket)

      socket.on('connect', () => {
        console.log("connected, " + socket.id)
        setInit(true)
      })

      socket.on('hi', (data: string) => {
        console.log(`data: ${data}`)
        setId(data)
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    })
  }, [])

  useEffect(() => {
    if (init && socket?.connected) {
      console.log("sending init")
      socket.emit("init", "test")
      setInit(false)
    }
  }, [init, socket?.connected])

  return (
    <main className={`${inter.className}`}>
      <p className="text-4xl">Hello, {id}</p>
    </main>
  );
}
