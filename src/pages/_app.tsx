import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Socket, io } from "socket.io-client";
import { useState, useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [globalSocket, setGlobalSocket] = useState<Socket>()

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      const socket: Socket = io({
        "withCredentials": true
      })

      socket.on('connect', () => {
        console.log("connected, " + socket.id)
        setGlobalSocket(socket)
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    })
  }, [])

  return <Component socket={globalSocket} {...pageProps} />;
}
