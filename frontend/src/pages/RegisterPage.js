import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 24px 16px;
  }

  .rp-bg {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }
  .rp-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(8,12,25,0.82) 0%, rgba(13,17,23,0.75) 100%);
  }

  .rp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    background: rgba(22, 27, 34, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 44px 40px 40px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,247,0.06);
    animation: rp-slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes rp-slide-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rp-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .rp-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: #e6edf3;
    line-height: 1.2;
  }
  .rp-logo-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4f8ef7;
  }

  .rp-heading {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: #e6edf3;
    text-align: center;
    margin-bottom: 6px;
  }
  .rp-subheading {
    text-align: center;
    font-size: 13px;
    color: #8b949e;
    margin-bottom: 32px;
  }

  .rp-error {
    background: rgba(220,38,38,0.1);
    border: 1px solid rgba(220,38,38,0.25);
    color: #f87171;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 13px;
    animation: rp-shake 0.35s ease;
  }
  @keyframes rp-shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-6px); }
    75%      { transform: translateX(6px); }
  }

  .rp-success {
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    color: #6ee7b7;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 13px;
  }

  .rp-field {
    margin-bottom: 16px;
  }
  .rp-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8b949e;
    margin-bottom: 7px;
  }
  .rp-input-wrap {
    position: relative;
  }
  .rp-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    pointer-events: none;
    opacity: 0.45;
  }
  .rp-input {
    width: 100%;
    padding: 11px 14px 11px 38px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    color: #e6edf3;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .rp-input::placeholder { color: #484f58; }
  .rp-input:focus {
    border-color: rgba(79,142,247,0.55);
    background: rgba(79,142,247,0.05);
    box-shadow: 0 0 0 3px rgba(79,142,247,0.1);
  }
  .rp-input.valid {
    border-color: rgba(16,185,129,0.45);
  }

  /* Password strength bar */
  .rp-strength {
    margin-top: 8px;
  }
  .rp-strength-bar {
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.07);
    overflow: hidden;
    margin-bottom: 5px;
  }
  .rp-strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s, background 0.3s;
  }
  .rp-strength-label {
    font-size: 11px;
    font-weight: 500;
  }

  .rp-submit {
    width: 100%;
    margin-top: 8px;
    padding: 12px;
    background: linear-gradient(135deg, #4f8ef7 0%, #6366f1 100%);
    color: #fff;
    border: none;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 16px rgba(79,142,247,0.3);
  }
  .rp-submit:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(79,142,247,0.4);
  }
  .rp-submit:active { transform: translateY(0); }
  .rp-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .rp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
    color: #484f58;
    font-size: 12px;
  }
  .rp-divider::before, .rp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .rp-footer {
    text-align: center;
    font-size: 13px;
    color: #8b949e;
  }
  .rp-footer a {
    color: #4f8ef7;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s;
  }
  .rp-footer a:hover { color: #93c5fd; }

  /* Terms note */
  .rp-terms {
    text-align: center;
    font-size: 11px;
    color: #484f58;
    margin-top: 14px;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    .rp-card { padding: 32px 20px 28px; }
    .rp-heading { font-size: 22px; }
    .rp-step-line { width: 30px; }
  }
`

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent", width: "0%" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: "Too short",  color: "#ef4444", width: "20%" },
    { label: "Weak",       color: "#f97316", width: "35%" },
    { label: "Fair",       color: "#eab308", width: "55%" },
    { label: "Good",       color: "#3b82f6", width: "75%" },
    { label: "Strong",     color: "#10b981", width: "100%" },
  ]
  return { score, ...map[Math.min(score, 4)] }
}

function RegisterPage() {
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const navigate = useNavigate()
  const strength = getStrength(password)

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
    <>
      <style>{styles}</style>
      <div className="rp-root">

        <div className="rp-bg" style={{ backgroundImage: `url(${bg})` }} />

        <div className="rp-card">

          {/* Logo */}
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

            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
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
                  <span className="rp-strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button className="rp-submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>

          </form>

          <p className="rp-terms">
            By registering you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="rp-divider">or</div>

          <p className="rp-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default RegisterPage