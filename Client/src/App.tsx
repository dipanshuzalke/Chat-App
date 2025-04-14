import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Dashboard } from "./src/Dashboard";
import Chat from "./src/Chat";
import { RoomProvider } from "./context/roomContext"; // adjust path

function App() {
  return (
    <RoomProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </RoomProvider>
  );
}

export default App;
