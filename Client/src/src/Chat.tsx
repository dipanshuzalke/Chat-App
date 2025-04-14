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
import { useRoom } from "@/context/roomContext";

function Chat() {
  const { roomCode } = useRoom(); // get the shared roomCode
// const { roomCode } = useParams(); // <-- Access room code from URL

  // State to store chat messages with initial "Hello from server!" message
  const [messages, setMessages] = useState(["Hello from the server!"]);

  // Refs to store WebSocket connection and input element
  const wsRef = useRef(null); // WebSocket connection reference
  const inputRef = useRef(null); // Input field reference

  useEffect(() => {
    // Create new WebSocket connection to local server
    const ws = new WebSocket("ws://localhost:8080");

    // Handle incoming messages from server
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    // Store WebSocket connection in ref for later use
    // @ts-ignore
    wsRef.current = ws;

    // When connection opens, send join room message
    ws.onopen = () => {
      if (roomCode) {
        ws.send(
          JSON.stringify({
            type: "join",
            payload: {
              roomId: roomCode,
            },
          })
        );
      }
    };    

    // Cleanup: close WebSocket when component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array means this runs once on mount

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
        <p>Users: </p>
      </CardContent>
      <CardContent className="h-[60vh] overflow-y-auto flex flex-col border rounded-lg ml-5 mr-5">
        {/* Display all messages */}
        {messages.map((message) => (
          <div className="m-8">
            <span className="bg-white text-black rounded p-4 ">{message}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input
          ref={inputRef}
          id="message"
          placeholder="Type a message..."
          className="p-5"
        />
        <Button
          variant="outline"
          className="text-lg w-24 bg-black text-white border border-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-100 p-5"
          onClick={() => {
            // @ts-ignore
            const message = inputRef.current?.value;
            // Send chat message through WebSocket
            // @ts-ignore
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );
          }}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Chat;
