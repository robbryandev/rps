import { Server } from 'socket.io'

export default function ioHandler(req, res) {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)

    const getRoomData = (socket, code = "") => {
      const rooms = socket.rooms;
      const playersInRoom = io.sockets.adapter.rooms.get(code);
      let players = [];
      if (playersInRoom) {
        players = Array.from(playersInRoom);
      }
      return JSON.stringify({data: [...rooms], players: players});
    }

    io.on("connection", async (socket) => {
      console.log("connect signal")
      console.log(`connected: ${socket.id}`)
      socket.join(socket.id)

      socket.on("room", () => {
        let code = socket.id;
        if ([...socket.rooms].length > 1) {
          code = [...socket.rooms][1];
        }
        socket.emit("room_data", getRoomData(socket, code));
        socket.to(code).emit("room_data", getRoomData(socket, code));
      })

      socket.on("join_room", (code) => {
        console.log("join signal")
        console.log(`code: ${code}`)
        socket.join(code);
        socket.emit("join_confirm");
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