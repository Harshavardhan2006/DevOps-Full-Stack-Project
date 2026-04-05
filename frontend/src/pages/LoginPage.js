import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"
import "../styles/styles.css"

function LoginPage({ setToken }) {
  const [mode,     setMode]     = useState("student")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const navigate = useNavigate()
  const isAdmin  = mode === "admin"

  const switchMode = (m) => { setMode(m); setError(""); setEmail(""); setPassword("") }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      const { token, user } = res.data

      if (isAdmin && user?.role !== "admin") {
        setError("Access denied. This account does not have admin privileges.")
        setLoading(false)
        return
      }
      if (!isAdmin && user?.role === "admin") {
        setError("Please use the Admin Login to access your account.")
        setLoading(false)
        return
      }

      localStorage.setItem("token", token)
      setToken(token)
      navigate(isAdmin ? "/admin" : "/home")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lp-root">

      <div className="lp-bg" style={{ backgroundImage: `url(${bg})` }} />

      <div className="lp-mode-toggle">
        <button className={`lp-mode-btn${!isAdmin ? " active-student" : ""}`} onClick={() => switchMode("student")}>
          <span className="lp-mode-icon">🎓</span> Student
        </button>
        <button className={`lp-mode-btn${isAdmin ? " active-admin" : ""}`} onClick={() => switchMode("admin")}>
          <span className="lp-mode-icon">🛡️</span> Admin
        </button>
      </div>

      <div className={`lp-card${isAdmin ? " admin-mode" : ""}`}>

        <div className="lp-logo">
          <div className={`lp-logo-icon ${mode}`}>
            {isAdmin ? "🛡️" : (
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
            )}
          </div>
          <div>
            <div className={`lp-logo-sub ${mode}`}>{isAdmin ? "Admin Portal" : "Student Resource"}</div>
            <div className="lp-logo-text">{isAdmin ? "Control Panel" : "Sharing Platform"}</div>
          </div>
        </div>

        <div className={`lp-mode-banner ${mode}`}>
          <span className="lp-banner-icon">{isAdmin ? "⚠️" : "ℹ️"}</span>
          <span>
            {isAdmin
              ? "Admin access only. You will be redirected to the dashboard."
              : "Sign in to browse, upload and download study resources."
            }
          </span>
        </div>

        <h2 className="lp-heading">{isAdmin ? "Admin Sign In" : "Welcome back"}</h2>
        <p className="lp-subheading">{isAdmin ? "Enter your admin credentials to continue" : "Sign in to access your resources"}</p>

        {error && <div className="lp-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="lp-field">
            <label className="lp-label">Email address</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon">✉</span>
              <input
                className={`lp-input${isAdmin ? " admin-focus" : ""}`}
                type="email"
                placeholder={isAdmin ? "admin@university.edu" : "you@university.edu"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="lp-field">
            <label className="lp-label">Password</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon">🔒</span>
              <input
                className={`lp-input${isAdmin ? " admin-focus" : ""}`}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className={`lp-submit ${mode}`} type="submit" disabled={loading}>
            {loading ? "Signing in…" : isAdmin ? "Access Dashboard →" : "Sign In →"}
          </button>
        </form>

        {!isAdmin && (
          <>
            <div className="lp-divider">or</div>
            <p className="lp-footer">
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage