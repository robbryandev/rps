import { Server } from 'socket.io'

export default function ioHandler(req, res) {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)

    const getRoomData = (socket, code = "", left=false) => {
      const rooms = socket.rooms;
      const playersInRoom = io.sockets.adapter.rooms.get(code);
      let players = [];
      if (playersInRoom) {
        players = Array.from(playersInRoom);
      }
      return JSON.stringify({data: [...rooms], players: players, playerLeft: left});
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
        if (io.sockets.adapter.rooms.get(code)) {
          const data = JSON.parse(getRoomData(socket, code));
          if (data.players.length < 2) {
            console.log("join signal")
            console.log(`code: ${code}`)
            socket.join(code);
            socket.emit("join_confirm")
          } else {
            socket.emit("room_full")
          }
        } else {
          socket.emit("room_not_found")
        }
      })

      socket.on("disconnecting", () => {
        console.log("user left")
        let code = socket.id;
        if ([...socket.rooms].length > 1) {
          code = [...socket.rooms][1];
        }
        console.log(`left code: ${code}`)
        socket.leave(code)
        io.to(code).emit("player_left", socket.id);
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