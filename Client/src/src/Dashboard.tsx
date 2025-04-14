import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle"; // ✅ Import toggle
import { IoChatbubbleOutline } from "react-icons/io5";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useRoom } from "@/context/roomContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { roomCode, setRoomCode } = useRoom();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateRoomCode = () => {
    // Function to generate a 6-character alphanumeric room code
    setLoading(true);
    setTimeout(() => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(
          Math.floor(Math.random() * characters.length)
        ); // Randomly pick a character
      }
      setRoomCode(code);
      setLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    // @ts-ignore
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCreateRoom = () => {
    if (!roomCode) {
      generateRoomCode(); // Ensure it's generated
      setTimeout(() => {
        navigate("/");
      }, 1100);
    } else {
      navigate("/chat");
    }
  };
  
  return (
    <div className="h-screen relative">
      {/* Top-right corner toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Centered content */}
      <div className="h-full flex items-center justify-center">
        <Card className="rounded-xl border w-[40%]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IoChatbubbleOutline className="text-2xl" />
              <CardTitle className="text-2xl">Real Time Chat</CardTitle>
            </div>
            <CardDescription>
              Temporary room that expires after all users exit
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              className="text-xl bg-black text-white border border-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-100 p-5"
              onClick={generateRoomCode}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <>
                  <LuLoaderCircle className="animate-spin mr-2 h-5 w-5" />
                  Creating...
                </>
              ) : (
                "Create New Room"
              )}
            </Button>

            <Input placeholder="Enter your name" />
            <div className="flex gap-2">
              <Input placeholder="Enter Room Code" />
              <Button
                variant="outline"
                className="text-lg w-30 bg-black text-white border border-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-100 pl-5 pr-5"
                onClick={handleCreateRoom}
              >
                Join Room
              </Button>
            </div>
          </CardContent>
          {/* Display the generated room code */}{" "}
          {roomCode && (
            <CardFooter className="flex justify-center backdrop-blur-md bg-white/10 border rounded-lg p-4 ml-6 mr-5">
              <div className="flex flex-col items-center gap-2 justify-center">
                <div>Share this code with your friend: </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono">{roomCode}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopy}
                    title="Copy Room Code"
                  >
                    <IoCopyOutline className="w-5 h-5" />
                  </Button>
                </div>
                {copied && (
                  <span className="text-sm text-green-500">Copied!</span>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
