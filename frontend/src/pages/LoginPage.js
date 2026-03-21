import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 24px 16px;
  }

  .lp-bg {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }
  .lp-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(8,12,25,0.82) 0%, rgba(13,17,23,0.75) 100%);
  }

  .lp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: rgba(22, 27, 34, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 44px 40px 40px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,247,0.06);
    animation: lp-slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes lp-slide-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .lp-logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #4f8ef7, #6366f1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 14px rgba(79,142,247,0.35);
  }
  .lp-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #e6edf3;
    line-height: 1.1;
  }
  .lp-logo-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4f8ef7;
  }

  .lp-heading {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: #e6edf3;
    text-align: center;
    margin-bottom: 6px;
  }
  .lp-subheading {
    text-align: center;
    font-size: 13px;
    color: #8b949e;
    margin-bottom: 32px;
  }

  .lp-error {
    background: rgba(220,38,38,0.1);
    border: 1px solid rgba(220,38,38,0.25);
    color: #f87171;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 13px;
    animation: lp-shake 0.35s ease;
  }
  @keyframes lp-shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-6px); }
    75%      { transform: translateX(6px); }
  }

  .lp-field {
    margin-bottom: 16px;
  }
  .lp-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8b949e;
    margin-bottom: 7px;
  }
  .lp-input-wrap {
    position: relative;
  }
  .lp-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    pointer-events: none;
    opacity: 0.5;
  }
  .lp-input {
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
  .lp-input::placeholder { color: #484f58; }
  .lp-input:focus {
    border-color: rgba(79,142,247,0.55);
    background: rgba(79,142,247,0.05);
    box-shadow: 0 0 0 3px rgba(79,142,247,0.1);
  }

  .lp-submit {
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
  .lp-submit:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(79,142,247,0.4);
  }
  .lp-submit:active {
    transform: translateY(0);
  }
  .lp-submit:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
    color: #484f58;
    font-size: 12px;
  }
  .lp-divider::before,
  .lp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .lp-footer {
    text-align: center;
    font-size: 13px;
    color: #8b949e;
  }
  .lp-footer a {
    color: #4f8ef7;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s;
  }
  .lp-footer a:hover { color: #93c5fd; }

  @media (max-width: 480px) {
    .lp-card { padding: 32px 24px 28px; }
    .lp-heading { font-size: 22px; }
  }
`

function LoginPage({ setToken }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      navigate("/home")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* Background image */}
        <div className="lp-bg" style={{ backgroundImage: `url(${bg})` }} />

        {/* Card */}
        <div className="lp-card">

          {/* Logo */}
          <div className="lp-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="url(#logo-grad)"/>
              {/* Open book */}
              <path d="M24 14C24 14 16 11 10 13V35C16 33 24 36 24 36C24 36 32 33 38 35V13C32 11 24 14 24 14Z" fill="white" fillOpacity="0.15"/>
              <path d="M24 14V36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 13V35" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M38 13V35" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 13C16 11 24 14 24 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M38 13C32 11 24 14 24 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 35C16 33 24 36 24 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M38 35C32 33 24 36 24 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              {/* Share arrows */}
              <circle cx="36" cy="14" r="5" fill="white" fillOpacity="0.9"/>
              <path d="M34.5 14H37.5M36 12.5V15.5" stroke="url(#logo-grad)" strokeWidth="1.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4f8ef7"/>
                  <stop offset="100%" stopColor="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div className="lp-logo-sub" style={{fontSize:"10px", letterSpacing:"0.1em"}}>STUDENT RESOURCE</div>
              <div className="lp-logo-text" style={{fontSize:"17px", lineHeight:"1.2"}}>Sharing Platform</div>
            </div>
          </div>

          <h2 className="lp-heading">Welcome back</h2>
          <p className="lp-subheading">Sign in to access your resources</p>

          {error && <div className="lp-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="lp-field">
              <label className="lp-label">Email address</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">✉</span>
                <input
                  className="lp-input"
                  type="email"
                  placeholder="you@university.edu"
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
                  className="lp-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="lp-submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="lp-divider">or</div>

          <p className="lp-footer">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default LoginPage