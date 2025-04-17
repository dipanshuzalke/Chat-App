"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import WebSocket-related classes from the 'ws' package
const ws_1 = require("ws");
// Create a WebSocket server instance listening on port 8080
const wss = new ws_1.WebSocketServer({ port: 8080 });
// Array to store all active WebSocket connections and their room assignments
let allSockets = [];
// Listen for new WebSocket connections
wss.on("connection", (socket) => {
    // Handle incoming messages from clients
    socket.on("message", (message) => {
        // Parse the incoming message from JSON string to object
        // @ts-ignore is used to bypass TypeScript type checking for the JSON.parse
        const parsedMessage = JSON.parse(message);
        // Handle 'join' message type - when a user wants to join a room
        if (parsedMessage.type === "join") {
            const { roomId, userName } = parsedMessage.payload;
            // Add the new user to allSockets array with their socket and requested room
            allSockets.push({
                socket,
                room: roomId,
                userName,
            });
            // Broadcast "user joined" to all users in the room
            allSockets.forEach((entry) => {
                if (entry.room === roomId) {
                    entry.socket.send(JSON.stringify({
                        type: "user-joined",
                        payload: {
                            userName,
                            message: `${userName} joined the room.`,
                        },
                    }));
                }
            });
        }
        // Handle 'chat' message type - when a user sends a chat message
        if (parsedMessage.type === "chat") {
            // Find the room of the user who sent the message
            let currentUserRoom = null;
            let senderName = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].room;
                    senderName = allSockets[i].userName;
                    break;
                }
            }
            //   // Broadcast the message to all users in the same room
            //   for (let i = 0; i < allSockets.length; i++) {
            //     if (allSockets[i].room === currentUserRoom) {
            //       allSockets[i].socket.send(parsedMessage.payload.message);
            //     }
            //   }
            if (currentUserRoom && senderName) {
                allSockets.forEach((entry) => {
                    if (entry.room === currentUserRoom) {
                        entry.socket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                userName: senderName,
                                message: parsedMessage.payload.message,
                            },
                        }));
                    }
                });
            }
        }
    });
});
