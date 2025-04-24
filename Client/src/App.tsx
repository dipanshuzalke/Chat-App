// src/App.tsx or App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Dashboard } from "./src/Dashboard";
import Chat from "./src/Chat";
import { RoomProvider } from "./context/RoomContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <RoomProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          <Analytics />
        </BrowserRouter>
      </ThemeProvider>
    </RoomProvider>
  );
}

export default App;
