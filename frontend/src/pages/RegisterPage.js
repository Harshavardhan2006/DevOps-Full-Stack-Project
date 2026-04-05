import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"
import "../styles/styles.css"

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent", width: "0%" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: "Too short", color: "#ef4444", width: "20%" },
    { label: "Weak",      color: "#f97316", width: "35%" },
    { label: "Fair",      color: "#eab308", width: "55%" },
    { label: "Good",      color: "#3b82f6", width: "75%" },
    { label: "Strong",    color: "#10b981", width: "100%" },
  ]
  return { score, ...map[Math.min(score, 4)] }
}

function RegisterPage() {
  const [name,     setName]     = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const navigate  = useNavigate()
  const strength  = getStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await API.post("/auth/register", { name, email, password })
      navigate("/login")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rp-root">

      <div className="rp-bg" style={{ backgroundImage: `url(${bg})` }} />

      <div className="rp-card">

        <div className="rp-logo">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="url(#rp-logo-grad)"/>
            <path d="M24 14C24 14 16 11 10 13V35C16 33 24 36 24 36C24 36 32 33 38 35V13C32 11 24 14 24 14Z" fill="white" fillOpacity="0.15"/>
            <path d="M24 14V36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 13C16 11 24 14 24 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M38 13C32 11 24 14 24 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 35C16 33 24 36 24 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M38 35C32 33 24 36 24 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="36" cy="14" r="5" fill="white" fillOpacity="0.9"/>
            <path d="M34.5 14H37.5M36 12.5V15.5" stroke="url(#rp-logo-grad)" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="rp-logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4f8ef7"/>
                <stop offset="100%" stopColor="#6366f1"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div className="rp-logo-sub">Student Resource</div>
            <div className="rp-logo-text">Sharing Platform</div>
          </div>
        </div>

        <h2 className="rp-heading">Create account</h2>
        <p className="rp-subheading">Join thousands of students sharing knowledge</p>

        {error && <div className="rp-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="rp-field">
            <label className="rp-label">Full name</label>
            <div className="rp-input-wrap">
              <span className="rp-input-icon">👤</span>
              <input
                className={`rp-input${name ? " valid" : ""}`}
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rp-field">
            <label className="rp-label">Email address</label>
            <div className="rp-input-wrap">
              <span className="rp-input-icon">✉</span>
              <input
                className={`rp-input${email ? " valid" : ""}`}
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rp-field">
            <label className="rp-label">Password</label>
            <div className="rp-input-wrap">
              <span className="rp-input-icon">🔒</span>
              <input
                className="rp-input"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {password && (
              <div className="rp-strength">
                <div className="rp-strength-bar">
                  <div className="rp-strength-fill" style={{ width: strength.width, background: strength.color }} />
                </div>
                <span className="rp-strength-label" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          <button className="rp-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>

        </form>

        <p className="rp-terms">By registering you agree to our Terms of Service and Privacy Policy.</p>

        <div className="rp-divider">or</div>

        <p className="rp-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage