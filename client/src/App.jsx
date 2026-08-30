import { useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Chrome shared by every signed in page
function AppLayout({ theme, onToggleTheme }) {
  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <Outlet />
    </>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("taskTrackerTheme") || "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskTrackerTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.82rem",
            boxShadow: "0 10px 30px rgba(26, 31, 46, 0.12)",
          },
          success: {
            icon: null,
          },
          error: {
            icon: null,
          },
        }}
      />

      <Routes>
        {/* Only reachable while logged out */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Everything below requires a valid session */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout theme={theme} onToggleTheme={toggleTheme} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
