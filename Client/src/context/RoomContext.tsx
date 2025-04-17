import React, { createContext, useContext, useState } from "react";

type RoomContextType = {
  roomCode: string | null;
  setRoomCode: (code: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  return (
    <RoomContext.Provider value={{ roomCode, setRoomCode, userName,setUserName, }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
