import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh; width: 100%; display: flex; justify-content: center;
    align-items: center; font-family: 'DM Sans', sans-serif;
    position: relative; padding: 24px 16px;
  }
  .lp-bg {
    position: fixed; inset: 0; background-size: cover;
    background-position: center; background-repeat: no-repeat; z-index: 0;
  }
  .lp-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(8,12,25,0.82) 0%, rgba(13,17,23,0.75) 100%);
  }

  /* MODE TOGGLE — top right */
  .lp-mode-toggle {
    position: fixed; top: 20px; right: 20px; z-index: 10;
    display: flex; align-items: center;
    background: rgba(22,27,34,0.92); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 999px; padding: 4px; gap: 2px;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .lp-mode-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 999px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.22s ease; white-space: nowrap;
    background: transparent; color: #8b949e;
  }
  .lp-mode-btn.active-student {
    background: linear-gradient(135deg, #4f8ef7, #6366f1);
    color: #fff; box-shadow: 0 2px 10px rgba(79,142,247,0.35);
  }
  .lp-mode-btn.active-admin {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff; box-shadow: 0 2px 10px rgba(245,158,11,0.35);
  }
  .lp-mode-icon { font-size: 14px; }

  /* CARD */
  .lp-card {
    position: relative; z-index: 1; width: 100%; max-width: 420px;
    background: rgba(22,27,34,0.92); backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 44px 40px 40px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    animation: lp-slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
    transition: border-color 0.3s;
  }
  .lp-card.admin-mode {
    border-color: rgba(245,158,11,0.2);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.08);
  }
  @keyframes lp-slide-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* LOGO */
  .lp-logo { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:28px; }
  .lp-logo-icon {
    width:42px; height:42px; border-radius:11px;
    display:flex; align-items:center; justify-content:center; font-size:21px;
    box-shadow: 0 4px 14px rgba(79,142,247,0.3); flex-shrink:0; transition: all 0.3s;
  }
  .lp-logo-icon.student { background: linear-gradient(135deg,#4f8ef7,#6366f1); }
  .lp-logo-icon.admin   { background: linear-gradient(135deg,#f59e0b,#ef4444); box-shadow: 0 4px 14px rgba(245,158,11,0.3); }
  .lp-logo-text { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:#e6edf3; line-height:1.2; }
  .lp-logo-sub  { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; transition:color 0.3s; }
  .lp-logo-sub.student { color:#4f8ef7; }
  .lp-logo-sub.admin   { color:#f59e0b; }

  /* MODE BANNER inside card */
  .lp-mode-banner {
    display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px;
    margin-bottom:24px; font-size:13px; font-weight:500; line-height:1.45;
    animation: lp-fade 0.25s ease;
  }
  @keyframes lp-fade { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .lp-mode-banner.student { background:rgba(79,142,247,0.08); border:1px solid rgba(79,142,247,0.18); color:#93c5fd; }
  .lp-mode-banner.admin   { background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2);  color:#fcd34d; }
  .lp-banner-icon { font-size:18px; flex-shrink:0; }

  .lp-heading    { font-family:'Playfair Display',serif; font-size:26px; font-weight:900; color:#e6edf3; text-align:center; margin-bottom:6px; }
  .lp-subheading { text-align:center; font-size:13px; color:#8b949e; margin-bottom:32px; }

  .lp-error {
    background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.25);
    color:#f87171; padding:10px 14px; border-radius:8px; margin-bottom:20px;
    text-align:center; font-size:13px; animation:lp-shake 0.35s ease;
  }
  @keyframes lp-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

  .lp-field { margin-bottom:16px; }
  .lp-label { display:block; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#8b949e; margin-bottom:7px; }
  .lp-input-wrap { position:relative; }
  .lp-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; pointer-events:none; opacity:0.45; }
  .lp-input {
    width:100%; padding:11px 14px 11px 38px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
    border-radius:9px; color:#e6edf3; font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .lp-input::placeholder { color:#484f58; }
  .lp-input:focus {
    border-color:rgba(79,142,247,0.55); background:rgba(79,142,247,0.05);
    box-shadow:0 0 0 3px rgba(79,142,247,0.1);
  }
  .lp-input.admin-focus:focus {
    border-color:rgba(245,158,11,0.55); background:rgba(245,158,11,0.04);
    box-shadow:0 0 0 3px rgba(245,158,11,0.1);
  }

  /* Submit button */
  .lp-submit {
    width:100%; margin-top:8px; padding:12px; color:#fff; border:none; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer;
    letter-spacing:0.02em; transition:opacity 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .lp-submit.student {
    background:linear-gradient(135deg,#4f8ef7 0%,#6366f1 100%);
    box-shadow:0 4px 16px rgba(79,142,247,0.3);
  }
  .lp-submit.student:hover { opacity:0.92; transform:translateY(-1px); box-shadow:0 8px 24px rgba(79,142,247,0.4); }
  .lp-submit.admin {
    background:linear-gradient(135deg,#f59e0b 0%,#ef4444 100%);
    box-shadow:0 4px 16px rgba(245,158,11,0.3);
  }
  .lp-submit.admin:hover { opacity:0.92; transform:translateY(-1px); box-shadow:0 8px 24px rgba(245,158,11,0.4); }
  .lp-submit:active   { transform:translateY(0); }
  .lp-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  .lp-divider { display:flex; align-items:center; gap:12px; margin:24px 0 20px; color:#484f58; font-size:12px; }
  .lp-divider::before,.lp-divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }

  .lp-footer { text-align:center; font-size:13px; color:#8b949e; }
  .lp-footer a { color:#4f8ef7; font-weight:600; text-decoration:none; transition:color 0.15s; }
  .lp-footer a:hover { color:#93c5fd; }

  @media (max-width:480px) {
    .lp-card { padding:32px 24px 28px; }
    .lp-heading { font-size:22px; }
    .lp-mode-toggle { top:12px; right:12px; }
    .lp-mode-btn { padding:6px 12px; font-size:12px; }
  }
`

function LoginPage({ setToken }) {
  const [mode,     setMode]     = useState("student")  // "student" | "admin"
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const navigate = useNavigate()
  const isAdmin  = mode === "admin"

  const switchMode = (m) => {
    setMode(m)
    setError("")
    setEmail("")
    setPassword("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      const { token, user } = res.data

      // Admin mode: block non-admins
      if (isAdmin && user?.role !== "admin") {
        setError("Access denied. This account does not have admin privileges.")
        setLoading(false)
        return
      }

      // Student mode: block admins trying to use student login
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
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* Background */}
        <div className="lp-bg" style={{ backgroundImage: `url(${bg})` }} />

        {/* Mode toggle — top right */}
        <div className="lp-mode-toggle">
          <button
            className={`lp-mode-btn${!isAdmin ? " active-student" : ""}`}
            onClick={() => switchMode("student")}
          >
            <span className="lp-mode-icon">🎓</span> Student
          </button>
          <button
            className={`lp-mode-btn${isAdmin ? " active-admin" : ""}`}
            onClick={() => switchMode("admin")}
          >
            <span className="lp-mode-icon">🛡️</span> Admin
          </button>
        </div>

        {/* Card */}
        <div className={`lp-card${isAdmin ? " admin-mode" : ""}`}>

          {/* Logo */}
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
              <div className={`lp-logo-sub ${mode}`}>
                {isAdmin ? "Admin Portal" : "Student Resource"}
              </div>
              <div className="lp-logo-text">
                {isAdmin ? "Control Panel" : "Sharing Platform"}
              </div>
            </div>
          </div>

          {/* Mode info banner */}
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
          <p className="lp-subheading">
            {isAdmin ? "Enter your admin credentials to continue" : "Sign in to access your resources"}
          </p>

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

            <button
              className={`lp-submit ${mode}`}
              type="submit"
              disabled={loading}
            >
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
    </>
  )
}

export default LoginPage