import { WebSocketServer, WebSocket } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  userName: string;
}

const wss = new WebSocketServer({ port: 8080 });
let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === "join") {
        const { roomId, userName } = parsedMessage.payload;

        // Prevent duplicate user entries (e.g., on refresh)
        allSockets = allSockets.filter(user => user.socket !== socket);

        // Add new user
        allSockets.push({ socket, room: roomId, userName });

        // Get updated user list for this room
        const usersInRoom = allSockets
          .filter((user) => user.room === roomId)
          .map((user) => user.userName);

        // Send user list to the new user
        socket.send(JSON.stringify({
          type: "user-list",
          payload: { users: usersInRoom },
        }));

        // Broadcast to others in the same room that a new user joined
        allSockets.forEach((user) => {
          if (user.room === roomId && user.socket !== socket) {
            user.socket.send(JSON.stringify({
              type: "user-joined",
              payload: { userName },
            }));
          }
        });
      }

      if (parsedMessage.type === "chat") {
        const sender = allSockets.find((u) => u.socket === socket);
        if (!sender) return;

        allSockets.forEach((user) => {
          if (user.room === sender.room) {
            user.socket.send(JSON.stringify({
              type: "chat",
              payload: {
                userName: sender.userName,
                message: parsedMessage.payload.message,
              },
            }));
          }
        });
      }
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    const userIndex = allSockets.findIndex((user) => user.socket === socket);

    if (userIndex !== -1) {
      const { room, userName } = allSockets[userIndex];

      // Remove user from socket list
      allSockets.splice(userIndex, 1);

      // Inform others in the same room
      allSockets.forEach((user) => {
        if (user.room === room) {
          user.socket.send(JSON.stringify({
            type: "user-left",
            payload: { userName },
          }));
        }
      });

      console.log(`👋 ${userName} left room: ${room}`);
    }
  });

  socket.on("error", (err) => {
    console.error("⚠️ WebSocket error:", err);
  });
});
