import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import API from "../services/api"
import { useTheme } from "../App"
import "../styles/styles.css"   // ← renamed from styles.css

function Navbar() {
  const [open,   setOpen]   = useState(false)
  const [ddOpen, setDdOpen] = useState(false)
  const [user,   setUser]   = useState(null)
  const dropRef  = useRef(null)
  const location = useLocation()

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    fetchUser()
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDdOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await API.get("/auth/me")
      setUser(res.data)
    } catch (err) { console.log(err) }
  }

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const isActive = (path) => location.pathname === path
  const initials = user?.name ? user.name.trim()[0].toUpperCase() : "?"

  const navItems = [
    { to: "/home",   label: "Home"   },
    { to: "/upload", label: "Upload" },
  ]

  return (
    <nav className="nav-root">
      <div className="nav-inner">

        <Link to="/home" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path d="M24 14C24 14 16 11 10 13V35C16 33 24 36 24 36C24 36 32 33 38 35V13C32 11 24 14 24 14Z" fill="white" fillOpacity="0.2"/>
              <path d="M24 14V36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M10 13C16 11 24 14 24 14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M38 13C32 11 24 14 24 14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 35C16 33 24 36 24 36" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M38 35C32 33 24 36 24 36" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="36" cy="14" r="5" fill="white" fillOpacity="0.95"/>
              <path d="M34.5 14H37.5M36 12.5V15.5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="nav-logo-text">
            <span className="nav-logo-top">Student Resource</span>
            <span className="nav-logo-bottom">Sharing Platform</span>
          </div>
        </Link>

        <div className="nav-links">
          {navItems.map(({ to, label }) => (
            <Link key={to} to={to} className={`nav-link${isActive(to) ? " active" : ""}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-right" ref={dropRef}>

          {/* ── Theme toggle ── */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {/* Sun icon */}
            <span className="icon-sun" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1"  x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1"  y1="12" x2="3"  y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </span>
            {/* Moon icon */}
            <span className="icon-moon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
          </button>

          <div className="nav-avatar-btn" onClick={() => setDdOpen(!ddOpen)}>
            {initials}
          </div>

          {ddOpen && (
            <div className="nav-dropdown">
              <div className="nav-dd-user">
                <div className="nav-dd-avatar">{initials}</div>
                <div>
                  <div className="nav-dd-name">{user?.name || "Student"}</div>
                  <div className="nav-dd-email">{user?.email || ""}</div>
                </div>
              </div>

              <Link to="/profile" className="nav-dd-item" onClick={() => setDdOpen(false)}>
                <span className="nav-dd-icon">👤</span> My Profile
              </Link>
              <Link to="/upload" className="nav-dd-item" onClick={() => setDdOpen(false)}>
                <span className="nav-dd-icon">📤</span> Upload Resource
              </Link>

              {user?.role === "admin" && (
                <>
                  <div className="nav-dd-divider" />
                  <Link to="/admin" className="nav-dd-item" onClick={() => setDdOpen(false)}>
                    <span className="nav-dd-icon">⚙️</span> Admin Dashboard
                    <span className="nav-dd-admin-badge">Admin</span>
                  </Link>
                </>
              )}

              <div className="nav-dd-divider" />
              <button className="nav-dd-item danger" onClick={logout}>
                <span className="nav-dd-icon">↩</span> Logout
              </button>
            </div>
          )}
        </div>

        <button
          className={`nav-hamburger${open ? " open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav-mobile${open ? " open" : ""}`}>
        {navItems.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link${isActive(to) ? " active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link
          to="/profile"
          className={`nav-link${isActive("/profile") ? " active" : ""}`}
          onClick={() => setOpen(false)}
        >
          My Profile
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`nav-link${isActive("/admin") ? " active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Admin Dashboard
          </Link>
        )}

        {/* Mobile theme toggle row */}
        <button
          className="nav-mobile-logout"
          style={{ color: "var(--toggle-icon-clr)" }}
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Mode"}
        </button>

        <button className="nav-mobile-logout" onClick={logout}>↩ Logout</button>
      </div>
    </nav>
  )
}

export default Navbar