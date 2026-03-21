import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Navbar from "./components/Navbar"

import HomePage       from "./pages/HomePage"
import UploadPage     from "./pages/UploadPage"
import LoginPage      from "./pages/LoginPage"
import RegisterPage   from "./pages/RegisterPage"
import ProfilePage    from "./pages/ProfilePage"
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

        <Route path="/" element={
          token ? <Navigate to="/home" /> : <Navigate to="/login" />
        } />

        <Route path="/login"    element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/home"    element={<HomePage />} />
        <Route path="/upload"  element={<UploadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin"   element={<AdminDashboard />} />

      </Routes>

    </Router>
  )

}

export default App