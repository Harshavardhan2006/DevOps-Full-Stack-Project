import { useNavigate } from "react-router-dom"
import "../styles/styles.css"

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: "📚",
      title: "Centralized Resource Hub",
      desc: "All your study materials in one place — notes, assignments, question papers, and guides organized by subject.",
    },
    {
      icon: "🔍",
      title: "Smart Search & Filters",
      desc: "Find exactly what you need with advanced filters by subject, type, and sort by downloads or ratings.",
    },
    {
      icon: "⭐",
      title: "Community Ratings",
      desc: "Rate resources and see what your peers found most helpful. Quality rises to the top.",
    },
    {
      icon: "📤",
      title: "Easy Uploads",
      desc: "Drag and drop your files to share with the community. Help others the way others helped you.",
    },
    {
      icon: "🔒",
      title: "Secure Access",
      desc: "JWT-based authentication ensures only verified students can access and contribute resources.",
    },
    {
      icon: "🛡️",
      title: "Admin Controls",
      desc: "Dedicated admin dashboard to monitor uploads, manage users, and keep the platform clean.",
    },
  ]

  const subjects = [
    "Data Structures", "Algorithms", "Operating Systems",
    "Computer Networks", "Database Systems", "Software Engineering", "Artificial Intelligence",
  ]

  const stats = [
    { value: "7+",   label: "Subjects Covered" },
    { value: "3",    label: "Resource Types" },
    { value: "100%", label: "Free to Use" },
    { value: "24/7", label: "Always Available" },
  ]

  return (
    <div className="land-root">

      {/* ── NAVBAR ── */}
      <header className="land-header">
        <div className="land-header-inner">
          <div className="land-logo">
            <div className="land-logo-icon">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
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
            <div>
              <div className="land-logo-sub">Student Resource</div>
              <div className="land-logo-name">Sharing Platform</div>
            </div>
          </div>
          <div className="land-header-actions">
            <button className="land-btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
            <button className="land-btn-primary" onClick={() => navigate("/register")}>Get Started</button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="land-hero">
        <div className="land-hero-glow land-hero-glow-left" />
        <div className="land-hero-glow land-hero-glow-right" />
        <div className="land-hero-inner">
          <div className="land-hero-badge">
            <span className="land-hero-badge-dot" />
            Open for all students
          </div>
          <h1 className="land-hero-title">
            Knowledge grows<br />when shared
          </h1>
          <p className="land-hero-sub">
            A centralized platform where students upload, discover, and download
            study resources — notes, assignments, and question papers — all in one place.
          </p>
          <div className="land-hero-cta">
            <button className="land-cta-primary" onClick={() => navigate("/register")}>
              Start for free →
            </button>
            <button className="land-cta-secondary" onClick={() => navigate("/login")}>
              Sign in to your account
            </button>
          </div>
          <div className="land-hero-stats">
            {stats.map(s => (
              <div className="land-stat" key={s.label}>
                <span className="land-stat-val">{s.value}</span>
                <span className="land-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="land-section">
        <div className="land-section-inner">
          <div className="land-section-label">Features</div>
          <h2 className="land-section-title">Everything you need to study smarter</h2>
          <p className="land-section-sub">Built specifically for college students to share and discover academic materials.</p>
          <div className="land-features-grid">
            {features.map(f => (
              <div className="land-feature-card" key={f.title}>
                <div className="land-feature-icon">{f.icon}</div>
                <h3 className="land-feature-title">{f.title}</h3>
                <p className="land-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section className="land-subjects-section">
        <div className="land-section-inner">
          <div className="land-section-label">Subjects</div>
          <h2 className="land-section-title">Core CS subjects covered</h2>
          <div className="land-subjects-wrap">
            {subjects.map(s => (
              <div className="land-subject-pill" key={s}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="land-section">
        <div className="land-section-inner">
          <div className="land-section-label">How it works</div>
          <h2 className="land-section-title">Three steps to get started</h2>
          <div className="land-steps">
            {[
              { num: "01", title: "Create an account", desc: "Register with your email in under a minute. No credit card, completely free." },
              { num: "02", title: "Browse or upload", desc: "Search thousands of resources by subject or type, or upload your own notes to help others." },
              { num: "03", title: "Rate and download", desc: "Download what you need, rate what helped you, and watch your contribution count grow." },
            ].map(step => (
              <div className="land-step" key={step.num}>
                <div className="land-step-num">{step.num}</div>
                <h3 className="land-step-title">{step.title}</h3>
                <p className="land-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="land-cta-section">
        <div className="land-cta-glow" />
        <div className="land-section-inner land-cta-inner">
          <h2 className="land-cta-title">Ready to start sharing?</h2>
          <p className="land-cta-sub">Join your fellow students. Upload your first resource today.</p>
          <div className="land-hero-cta">
            <button className="land-cta-primary" onClick={() => navigate("/register")}>
              Create free account →
            </button>
            <button className="land-cta-secondary" onClick={() => navigate("/login")}>
              Already have an account
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-logo">
            <div className="land-logo-icon">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
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
            <div>
              <div className="land-logo-sub">Student Resource</div>
              <div className="land-logo-name">Sharing Platform</div>
            </div>
          </div>
          <p className="land-footer-copy">Built for students, by students. Free forever.</p>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage