import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Navbar        from "./components/Navbar"
import LandingPage   from "./pages/LandingPage"
import HomePage      from "./pages/HomePage"
import UploadPage    from "./pages/UploadPage"
import LoginPage     from "./pages/LoginPage"
import RegisterPage  from "./pages/RegisterPage"
import ProfilePage   from "./pages/ProfilePage"
import AdminDashboard from "./pages/AdminDashboard"

function App() {

  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  return (
    <Router>

      {token && <Navbar />}

      <Routes>

        {/* Landing page — always accessible */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login"    element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* App — redirect to login if not authenticated */}
        <Route path="/home"    element={token ? <HomePage />      : <Navigate to="/login" />} />
        <Route path="/upload"  element={token ? <UploadPage />    : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <ProfilePage />   : <Navigate to="/login" />} />
        <Route path="/admin"   element={token ? <AdminDashboard /> : <Navigate to="/login" />} />

      </Routes>

    </Router>
  )

}

export default App