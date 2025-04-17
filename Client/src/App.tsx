import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Dashboard } from "./src/Dashboard";
import Chat from "./src/Chat";
import { RoomProvider } from "./context/RoomContext"; // adjust path
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <RoomProvider>
      <Toaster position="top-center" />
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
