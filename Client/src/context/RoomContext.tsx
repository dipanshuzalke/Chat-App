import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context shape
type RoomContextType = {
  roomCode: string | null;
  setRoomCode: (code: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
};

// Create the context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydrate initial state from localStorage
  const [roomCode, setRoomCodeState] = useState<string | null>(() => {
    return localStorage.getItem("roomCode");
  });
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem("userName") || "";
  });

  // Persist roomCode to localStorage whenever it changes
  useEffect(() => {
    if (roomCode) {
      localStorage.setItem("roomCode", roomCode);
    } else {
      localStorage.removeItem("roomCode");
    }
  }, [roomCode]);

  // Persist userName to localStorage whenever it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  // Wrapped setters to update state
  const setRoomCode = (code: string | null) => {
    setRoomCodeState(code);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
  };

  return (
    <RoomContext.Provider value={{ roomCode, setRoomCode, userName, setUserName }}>
      {children}
    </RoomContext.Provider>
  );
};

// Hook to consume the context
export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
