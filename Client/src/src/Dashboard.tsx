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
import { useRoom } from "@/context/RoomContext";
import toast from "react-hot-toast";

export function Dashboard() {
  const navigate = useNavigate();
  const { roomCode, setRoomCode, setUserName } = useRoom();

  const [name, setName] = useState(""); // ← your user’s name
  const [enteredCode, setEnteredCode] = useState(""); // ← code to join
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
      setEnteredCode(code);
      setLoading(false);
    }, 1000);
  };

  const handleCreateRoom = () => {
    if (!name.trim() || !enteredCode.trim()) {
      toast.error("Name and Room code is required");
      return;
    }
    // Ensure exactly 6 chars A–Z or 0–9
    if (!/^[A-Z0-9]{6}$/.test(enteredCode)) {
      toast.error("Room code must be exactly 6 letters or digits");
      return;
    }
    {
      // Set userName from the name input field
      setUserName(name.trim());
      setRoomCode(enteredCode.trim());
      navigate("/chat");
    }
  };

  const handleCopy = () => {
    // @ts-ignore
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-screen relative px-4 sm:px-6">
      {/* Top-right corner toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Centered content */}
      <div className="h-full flex items-center justify-center">
        <Card className="w-full max-w-md sm:max-w-lg md:w-[60%] lg:w-[40%] rounded-xl border">
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <LuLoaderCircle className="animate-spin mr-2 h-5 w-5" />
                  Creating Room...
                </>
              ) : (
                "Create New Room"
              )}
            </Button>

            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="w-full flex gap-2 sm:flex-row">
              <Input
                placeholder="Enter Room Code"
                value={enteredCode}
                onChange={(e) => {
                  // Uppercase + strip non A–Z0–9, up to 6 chars
                  const sanitized = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6);
                  setEnteredCode(sanitized);
                }}
                maxLength={6}
                className="sm:flex-1"
              />
              <Button
                variant="outline"
                className="text-lg bg-black text-white border border-gray-800 hover:text-white hover:bg-gray-900
             dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-100
             px-6"
                onClick={handleCreateRoom}
              >
                Join Room
              </Button>
            </div>
          </CardContent>

          {/* Display the generated room code */}
          {roomCode && (
            <CardFooter className="flex justify-center backdrop-blur-md bg-white/10 border rounded-lg p-4 mx-4 mt-2">
              <div className="flex flex-col items-center gap-2">
                <div>Share this code with your friend:</div>
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
