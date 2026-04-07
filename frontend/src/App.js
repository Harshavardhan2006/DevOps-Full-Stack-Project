import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect, createContext, useContext } from "react"

import Navbar         from "./components/Navbar"
import LandingPage    from "./pages/LandingPage"
import HomePage       from "./pages/HomePage"
import UploadPage     from "./pages/UploadPage"
import LoginPage      from "./pages/LoginPage"
import RegisterPage   from "./pages/RegisterPage"
import ProfilePage    from "./pages/ProfilePage"
import AdminDashboard from "./pages/AdminDashboard"

// ── Theme context ────────────────────────────────────────────
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
})
export const useTheme = () => useContext(ThemeContext)

function App() {

  // ── Auth ─────────────────────────────────────────────────
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  // ── Theme ─────────────────────────────────────────────────
  // Initialise from localStorage; fall back to system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "light" || saved === "dark") return saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  // Apply [data-theme] to <html> whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === "light" ? "dark" : "light"))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>

        {token && <Navbar />}

        <Routes>

          <Route path="/" element={token ? <Navigate to="/home" /> : <LandingPage />} />

          <Route path="/login"    element={<LoginPage setToken={setToken} />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/home"    element={token ? <HomePage />       : <Navigate to="/login" />} />
          <Route path="/upload"  element={token ? <UploadPage />     : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <ProfilePage />    : <Navigate to="/login" />} />
          <Route path="/admin"   element={token ? <AdminDashboard /> : <Navigate to="/login" />} />

        </Routes>

      </Router>
    </ThemeContext.Provider>
  )
}

export default App