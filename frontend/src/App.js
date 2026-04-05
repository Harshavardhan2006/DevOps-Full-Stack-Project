import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

import Navbar         from "./components/Navbar"
import LandingPage    from "./pages/LandingPage"
import HomePage       from "./pages/HomePage"
import UploadPage     from "./pages/UploadPage"
import LoginPage      from "./pages/LoginPage"
import RegisterPage   from "./pages/RegisterPage"
import ProfilePage    from "./pages/ProfilePage"
import AdminDashboard from "./pages/AdminDashboard"

function App() {

  // Read token directly from localStorage as initial state — no useEffect needed.
  // This means on refresh the token is available immediately, preventing the
  // brief null → redirect flash that was kicking logged-in users to /login.
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  return (
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
  )

}

export default App