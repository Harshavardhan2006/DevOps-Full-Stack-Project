import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import API from "../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .nav-root {
    position: sticky; top: 0; z-index: 50; width: 100%;
    background: rgba(13, 17, 23, 0.9);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 28px; height: 62px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
  }

  /* Logo */
  .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; flex-shrink:0; }
  .nav-logo-icon {
    width:36px; height:36px; border-radius:9px;
    background:linear-gradient(135deg,#4f8ef7,#6366f1);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 10px rgba(79,142,247,0.3); flex-shrink:0;
  }
  .nav-logo-text { display:flex; flex-direction:column; line-height:1.1; }
  .nav-logo-top  { font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:#4f8ef7; }
  .nav-logo-bottom { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; color:#e6edf3; }

  /* Links */
  .nav-links { display:flex; align-items:center; gap:4px; }
  .nav-link {
    display:flex; align-items:center; gap:6px; padding:7px 13px; border-radius:8px;
    font-size:14px; font-weight:500; color:#8b949e; text-decoration:none;
    transition:background 0.18s, color 0.18s; white-space:nowrap;
  }
  .nav-link:hover { background:rgba(255,255,255,0.06); color:#e6edf3; }
  .nav-link.active { background:rgba(79,142,247,0.12); color:#4f8ef7; }
  .nav-link-icon  { font-size:14px; opacity:0.8; }

  /* Right side */
  .nav-right { display:flex; align-items:center; gap:10px; flex-shrink:0; position:relative; }

  /* Avatar button */
  .nav-avatar-btn {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,#4f8ef7,#6366f1);
    display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:#fff;
    cursor:pointer; border:2px solid rgba(79,142,247,0.35);
    transition:border-color 0.18s, box-shadow 0.18s;
    text-transform:uppercase; flex-shrink:0; user-select:none;
    box-shadow:0 2px 8px rgba(79,142,247,0.2);
  }
  .nav-avatar-btn:hover { border-color:#4f8ef7; box-shadow:0 2px 12px rgba(79,142,247,0.4); }

  /* Dropdown */
  .nav-dropdown {
    position:absolute; top:calc(100% + 10px); right:0;
    background:#161b22; border:1px solid rgba(255,255,255,0.1);
    border-radius:14px; padding:8px; min-width:210px;
    box-shadow:0 16px 48px rgba(0,0,0,0.5);
    animation:nav-drop 0.18s cubic-bezier(0.22,1,0.36,1);
    z-index:200;
  }
  @keyframes nav-drop {
    from { opacity:0; transform:translateY(-8px) scale(0.96); }
    to   { opacity:1; transform:translateY(0)   scale(1); }
  }
  .nav-dd-user {
    padding:10px 12px 12px; border-bottom:1px solid rgba(255,255,255,0.07); margin-bottom:6px;
    display:flex; align-items:center; gap:10px;
  }
  .nav-dd-avatar {
    width:38px; height:38px; border-radius:50%;
    background:linear-gradient(135deg,#4f8ef7,#6366f1);
    display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-size:16px; font-weight:700; color:#fff;
    text-transform:uppercase; flex-shrink:0;
  }
  .nav-dd-name  { font-size:14px; font-weight:600; color:#e6edf3; }
  .nav-dd-email { font-size:11px; color:#8b949e; margin-top:1px; }

  .nav-dd-item {
    display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px;
    font-size:13px; font-weight:500; color:#8b949e; text-decoration:none; cursor:pointer;
    transition:background 0.15s, color 0.15s; width:100%; background:none; border:none;
    font-family:'DM Sans',sans-serif; text-align:left;
  }
  .nav-dd-item:hover { background:rgba(255,255,255,0.06); color:#e6edf3; }
  .nav-dd-item.danger { color:#f87171; }
  .nav-dd-item.danger:hover { background:rgba(239,68,68,0.1); color:#f87171; }
  .nav-dd-divider { height:1px; background:rgba(255,255,255,0.07); margin:6px 0; }
  .nav-dd-icon { font-size:14px; opacity:0.8; }

  /* Admin pill in dropdown */
  .nav-dd-admin-badge {
    margin-left:auto; font-size:9px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
    background:rgba(245,158,11,0.15); color:#f59e0b; padding:2px 7px; border-radius:999px;
  }

  /* Hamburger */
  .nav-hamburger {
    display:none; flex-direction:column; gap:5px; cursor:pointer;
    padding:6px; border-radius:8px; background:transparent; border:none; transition:background 0.18s;
  }
  .nav-hamburger:hover { background:rgba(255,255,255,0.06); }
  .nav-hamburger span { display:block; width:20px; height:2px; background:#8b949e; border-radius:2px; transition:all 0.25s ease; }
  .nav-hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity:0; }
  .nav-hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

  /* Mobile menu */
  .nav-mobile { display:none; flex-direction:column; border-top:1px solid rgba(255,255,255,0.07); padding:10px 16px 16px; gap:4px; background:rgba(13,17,23,0.97); }
  .nav-mobile.open { display:flex; }
  .nav-mobile .nav-link { padding:10px 14px; font-size:15px; }
  .nav-mobile-logout {
    display:flex; align-items:center; gap:10px; padding:10px 14px; margin-top:6px;
    border-radius:8px; font-size:14px; font-weight:600; color:#f87171; background:none; border:none;
    font-family:'DM Sans',sans-serif; cursor:pointer; transition:background 0.15s;
  }
  .nav-mobile-logout:hover { background:rgba(239,68,68,0.1); }

  @media (max-width:720px) {
    .nav-links, .nav-right { display:none; }
    .nav-hamburger { display:flex; }
    .nav-logo-text { display:none; }
  }
`

function Navbar() {
  const [open,     setOpen]     = useState(false)   // hamburger
  const [ddOpen,   setDdOpen]   = useState(false)   // avatar dropdown
  const [user,     setUser]     = useState(null)
  const dropRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    fetchUser()
    // Close dropdown on outside click
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDdOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      setUser(res.data)
    } catch (err) { console.log(err) }
  }

  const logout = () => { localStorage.removeItem("token"); window.location.href = "/login" }
  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  const initials = user?.name ? user.name.trim()[0].toUpperCase() : "?"

  const navItems = [
    { to: "/",           label: "Home",      },
    { to: "/upload",     label: "Upload", },
  ]

  return (
    <>
      <style>{styles}</style>
      <nav className="nav-root">
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
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

          {/* Desktop links */}
          <div className="nav-links">
            {navItems.map(({ to, label, icon }) => (
              <Link key={to} to={to} className={`nav-link${isActive(to) ? " active" : ""}`}>
                <span className="nav-link-icon">{icon}</span>{label}
              </Link>
            ))}
          </div>

          {/* Desktop right: avatar */}
          <div className="nav-right" ref={dropRef}>
            <div className="nav-avatar-btn" onClick={() => setDdOpen(!ddOpen)}>
              {initials}
            </div>

            {/* Dropdown */}
            {ddOpen && (
              <div className="nav-dropdown">
                {/* User info */}
                <div className="nav-dd-user">
                  <div className="nav-dd-avatar">{initials}</div>
                  <div>
                    <div className="nav-dd-name">{user?.name || "Student"}</div>
                    <div className="nav-dd-email">{user?.email || ""}</div>
                  </div>
                </div>

                <Link to="/profile" className="nav-dd-item" onClick={() => setDdOpen(false)}>
                  <span className="nav-dd-icon"></span> My Profile
                </Link>
                <Link to="/upload" className="nav-dd-item" onClick={() => setDdOpen(false)}>
                  <span className="nav-dd-icon"></span> Upload Resource
                </Link>

                {user?.role === "admin" && (
                  <>
                    <div className="nav-dd-divider" />
                    <Link to="/admin" className="nav-dd-item" onClick={() => setDdOpen(false)}>
                      <span className="nav-dd-icon"></span> Admin Dashboard
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

          {/* Mobile hamburger */}
          <button className={`nav-hamburger${open ? " open" : ""}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`nav-mobile${open ? " open" : ""}`}>
          {navItems.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={`nav-link${isActive(to) ? " active" : ""}`} onClick={() => setOpen(false)}>
              <span className="nav-link-icon">{icon}</span>{label}
            </Link>
          ))}
          <Link to="/profile" className={`nav-link${isActive("/profile") ? " active" : ""}`} onClick={() => setOpen(false)}>
            <span className="nav-link-icon"></span> My Profile
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className={`nav-link${isActive("/admin") ? " active" : ""}`} onClick={() => setOpen(false)}>
              <span className="nav-link-icon"></span> Admin Dashboard
            </Link>
          )}
          <button className="nav-mobile-logout" onClick={logout}>↩ Logout</button>
        </div>
      </nav>
    </>
  )
}

export default Navbar