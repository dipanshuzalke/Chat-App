import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoChatbubbleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoom } from "@/context/RoomContext";

type Message = {
  type: "chat" | "user-joined" | "user-left" | "user-list";
  payload: {
    userName?: string;
    message?: string;
    users?: string[];
  };
};

function Chat() {
  const { roomCode, userName } = useRoom();

  const [messages, setMessages] = useState<Message[]>([
    {
      type: "chat",
      payload: {
        userName: "Server",
        message: "Hello from the server!",
      },
    },
  ]);
  
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      if (roomCode && userName) {
        ws.send(
          JSON.stringify({
            type: "join",
            payload: { roomId: roomCode, userName },
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);

        switch (data.type) {
          case "chat":
          case "user-joined":
          case "user-left":
            setMessages((prev) => [...prev, data]);
            if (data.type === "user-joined") {
              setUsers((prev) => [...new Set([...prev, data.payload.userName!])]);
            }
            if (data.type === "user-left") {
              setUsers((prev) => prev.filter((u) => u !== data.payload.userName));
            }
            break;

          case "user-list":
            setUsers(data.payload.users || []);
            break;

          default:
            console.warn("Unhandled WebSocket message type:", data.type);
        }
      } catch (err) {
        console.error("Failed to parse message:", event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [roomCode, userName]);

  const sendMessage = () => {
    if (wsRef.current && message.trim()) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: { message, userName }
      }));
      setMessage("");
    }
  };

  return (
    <Card className="rounded-xl border w-[40%] mx-auto mt-5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <IoChatbubbleOutline className="text-2xl" />
          <CardTitle className="text-2xl">Real Time Chat</CardTitle>
        </div>
        <CardDescription>
          Temporary room that expires after all users exit
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between items-center backdrop-blur-md bg-white/10 border rounded-lg p-3 ml-5 mr-5">
        <p>Room Code : {roomCode}</p>
        <p>Users: {users.length}</p>
      </CardContent>

      <CardContent className="h-[60vh] overflow-y-auto flex flex-col border rounded-lg ml-5 mr-5">
      {messages.map((msg, idx) => (
          <div key={idx} className="m-2">
            {msg.type === "chat" ? (
              <span className="bg-white text-black rounded p-4">
                <strong>{msg.payload.userName}:</strong> {msg.payload.message}
              </span>
            ) : msg.type === "user-joined" ? (
              <span className="text-green-500">
                👋 {msg.payload.userName} joined the room.
              </span>
            ) : msg.type === "user-left" ? (
              <span className="text-red-500">
                👋 {msg.payload.userName} left the room.
              </span>
            ) : null}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Input
          ref={inputRef}
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="p-5"
        />
        <Button
          variant="outline"
          className="text-lg w-24 bg-black text-white border border-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-100 p-5"
          onClick={sendMessage}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Chat;
