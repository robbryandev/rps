import { Server } from 'socket.io'

export default function ioHandler(req, res) {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)

    io.on("connection", async (socket) => {
      console.log("connect signal")
      console.log(`connected: ${socket.id}`)
      socket.join(socket.id)
      socket.on("init", () => {
        console.log("init signal")
        io.to(socket.id).emit("hi", socket.id)
        console.log("init signal 2")
      })
    });

    res.socket.server.io = io
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}