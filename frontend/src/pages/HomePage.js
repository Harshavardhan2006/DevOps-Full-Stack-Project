import { useEffect, useState, useMemo } from "react"
import API from "../services/api"
import { StarDisplay } from "../components/StarRating"
import StarRating from "../components/StarRating"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d1117; --surface: #161b22; --surface-hover: #1c2333;
    --border: rgba(255,255,255,0.07); --accent: #4f8ef7;
    --accent-green: #3fb950; --text-primary: #e6edf3;
    --text-secondary: #8b949e; --text-muted: #484f58; --radius: 12px;
  }

  .hp-root { min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text-primary); padding:0 0 60px; }

  .hp-hero {
    background: linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1b2a 100%);
    border-bottom: 1px solid var(--border);
    padding: 52px 24px 44px; text-align: center; position: relative; overflow: hidden;
  }
  .hp-hero::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,142,247,0.12) 0%, transparent 70%);
    pointer-events:none;
  }
  .hp-hero-badge {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(79,142,247,0.12); border:1px solid rgba(79,142,247,0.25);
    color:var(--accent); font-size:12px; font-weight:600; letter-spacing:0.08em;
    text-transform:uppercase; padding:5px 14px; border-radius:999px; margin-bottom:18px;
  }
  .hp-hero h1 {
    font-family:'Playfair Display',serif; font-size:clamp(24px,5vw,44px); font-weight:900;
    line-height:1.2; max-width:660px; margin:0 auto 12px;
    background:linear-gradient(135deg,#e6edf3 0%,#8b949e 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .hp-hero p { font-size:14px; color:var(--text-secondary); max-width:440px; margin:0 auto; line-height:1.6; }

  .hp-controls { max-width:1140px; margin:0 auto; padding:28px 24px 0; display:flex; flex-direction:column; gap:14px; }
  .hp-top-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }

  .hp-search-wrap { position:relative; flex:1; min-width:200px; }
  .hp-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:14px; opacity:0.4; pointer-events:none; }
  .hp-search {
    width:100%; background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); padding:10px 14px 10px 38px;
    color:var(--text-primary); font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .hp-search::placeholder { color:var(--text-muted); }
  .hp-search:focus { border-color:rgba(79,142,247,0.5); box-shadow:0 0 0 3px rgba(79,142,247,0.1); }

  .hp-sort {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:10px 32px 10px 14px; color:var(--text-primary);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; outline:none; cursor:pointer;
    appearance:none; -webkit-appearance:none; min-width:160px;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b949e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 12px center;
    transition:border-color 0.2s;
  }
  .hp-sort option { background:#1c2333; }
  .hp-sort:focus { border-color:rgba(79,142,247,0.5); }

  .hp-filter-panel { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:16px 18px; }
  .hp-filter-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .hp-filter-label { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-muted); white-space:nowrap; min-width:60px; }
  .hp-filter-chips { display:flex; flex-wrap:wrap; gap:6px; flex:1; }
  .hp-chip {
    padding:5px 13px; border-radius:999px; border:1px solid var(--border);
    background:transparent; color:var(--text-secondary); font-family:'DM Sans',sans-serif;
    font-size:12px; font-weight:500; cursor:pointer; transition:all 0.18s; white-space:nowrap;
  }
  .hp-chip:hover { border-color:rgba(79,142,247,0.35); color:var(--text-primary); background:rgba(79,142,247,0.07); }
  .hp-chip.active { background:var(--accent); border-color:var(--accent); color:#fff; font-weight:600; }
  .hp-filter-divider { width:100%; height:1px; background:var(--border); margin:10px 0; }

  .hp-results-info {
    max-width:1140px; margin:14px auto 0; padding:0 24px;
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;
  }
  .hp-results-count { font-size:13px; color:var(--text-secondary); }
  .hp-results-count strong { color:var(--text-primary); }
  .hp-clear-btn { font-size:12px; font-weight:600; color:var(--accent); background:none; border:none; cursor:pointer; padding:0; }
  .hp-clear-btn:hover { text-decoration:underline; }

  .hp-grid { max-width:1140px; margin:18px auto 0; padding:0 24px; display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; }

  .hp-card {
    background:var(--surface); border:1px solid var(--border); border-radius:16px;
    padding:20px; display:flex; flex-direction:column; gap:9px;
    transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; cursor:default;
  }
  .hp-card:hover { transform:translateY(-4px); box-shadow:0 8px 32px rgba(0,0,0,0.4); border-color:rgba(79,142,247,0.22); background:var(--surface-hover); }
  .hp-card-top { display:flex; gap:6px; flex-wrap:wrap; align-items:center; justify-content:space-between; }
  .hp-card-subject { font-size:10px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; color:var(--accent); background:rgba(79,142,247,0.1); border-radius:4px; padding:3px 7px; }
  .hp-card-type { font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#8b5cf6; background:rgba(139,92,246,0.1); border-radius:4px; padding:3px 7px; }
  .hp-card h3 { font-size:14px; font-weight:600; line-height:1.4; color:var(--text-primary); }
  .hp-card-desc { font-size:12px; color:var(--text-secondary); line-height:1.55; flex:1; }

  .hp-card-rating { padding-top:8px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; }
  .hp-rating-toggle { font-size:11px; font-weight:600; color:var(--accent); background:none; border:none; cursor:pointer; padding:0; transition:opacity 0.18s; }
  .hp-rating-toggle:hover { opacity:0.75; }

  .hp-rating-modal {
    position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; z-index:200; padding:20px;
    animation:hp-fade 0.18s ease;
  }
  @keyframes hp-fade { from{opacity:0} to{opacity:1} }
  .hp-rating-box {
    background:#161b22; border:1px solid rgba(255,255,255,0.1); border-radius:16px;
    padding:28px; max-width:320px; width:100%; box-shadow:0 24px 64px rgba(0,0,0,0.6);
    animation:hp-pop 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes hp-pop { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
  .hp-rating-box-title { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:#e6edf3; margin-bottom:4px; }
  .hp-rating-box-sub { font-size:12px; color:#8b949e; margin-bottom:18px; }
  .hp-rating-close {
    display:block; width:100%; margin-top:14px; padding:8px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px;
    color:#8b949e; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s;
  }
  .hp-rating-close:hover { background:rgba(255,255,255,0.09); color:#e6edf3; }

  .hp-card-meta { display:flex; align-items:center; gap:14px; font-size:11px; color:var(--text-muted); padding-top:8px; border-top:1px solid var(--border); }
  .hp-card-actions { display:flex; gap:8px; margin-top:2px; }
  .hp-btn {
    flex:1; display:inline-flex; align-items:center; justify-content:center; gap:5px;
    padding:8px 10px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:12px;
    font-weight:600; text-decoration:none; transition:all 0.18s; cursor:pointer; border:none;
  }
  .hp-btn-view { background:rgba(79,142,247,0.1); color:var(--accent); border:1px solid rgba(79,142,247,0.2); }
  .hp-btn-view:hover { background:var(--accent); color:#fff; border-color:var(--accent); }
  .hp-btn-dl   { background:rgba(63,185,80,0.1); color:var(--accent-green); border:1px solid rgba(63,185,80,0.2); }
  .hp-btn-dl:hover { background:var(--accent-green); color:#fff; border-color:var(--accent-green); }

  .hp-empty { grid-column:1/-1; text-align:center; padding:80px 20px; color:var(--text-muted); }
  .hp-empty-icon { font-size:46px; margin-bottom:14px; }
  .hp-empty p { font-size:14px; }

  @media (max-width:640px) {
    .hp-hero { padding:36px 16px 30px; }
    .hp-controls, .hp-grid, .hp-results-info { padding-left:14px; padding-right:14px; }
    .hp-controls { padding-top:20px; }
    .hp-grid { grid-template-columns:1fr; gap:12px; }
    .hp-sort { min-width:120px; font-size:12px; }
  }
`

const SUBJECTS = ["All","Data Structures","Operating Systems","Algorithms","Computer Networks","Database Systems","Software Engineering","Artificial Intelligence"]
const TYPES    = ["All","Notes","Assignment","Question Paper"]
const SORTS    = [
  { value:"newest",    label:"Newest first" },
  { value:"oldest",    label:"Oldest first" },
  { value:"downloads", label:"Most downloaded" },
  { value:"rating",    label:"Highest rated" },
  { value:"title",     label:"A → Z" },
]

function HomePage() {
  const [resources,   setResources]   = useState([])
  const [search,      setSearch]      = useState("")
  const [subject,     setSubject]     = useState("All")
  const [type,        setType]        = useState("All")
  const [sort,        setSort]        = useState("newest")
  const [ratingOpen,  setRatingOpen]  = useState(null)

  useEffect(() => { fetchResources() }, [])

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources")
      setResources(res.data)
    } catch (err) { console.log(err) }
  }

  const hasFilters = search || subject !== "All" || type !== "All" || sort !== "newest"
  const clearFilters = () => { setSearch(""); setSubject("All"); setType("All"); setSort("newest") }

  const filtered = useMemo(() => {
    let list = resources.filter(r => {
      const q = search.toLowerCase()
      const matchSearch  = !q || r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q) || r.subject?.toLowerCase().includes(q)
      const matchSubject = subject === "All" || r.subject === subject
      const matchType    = type === "All"    || r.type === type
      return matchSearch && matchSubject && matchType
    })
    return [...list].sort((a, b) => {
      if (sort === "newest")    return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === "oldest")    return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === "downloads") return (b.downloads || 0) - (a.downloads || 0)
      if (sort === "rating")    return (b.avgRating  || 0) - (a.avgRating  || 0)
      if (sort === "title")     return a.title?.localeCompare(b.title)
      return 0
    })
  }, [resources, search, subject, type, sort])

  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">

        <div className="hp-hero">
          <div className="hp-hero-badge">📚 Open Knowledge Hub</div>
          <h1>Knowledge grows when shared, and shines brightest when accessible to all.</h1>
          <p>Browse, preview, and download study resources across all core CS subjects.</p>
        </div>

        <div className="hp-controls">
          <div className="hp-top-row">
            <div className="hp-search-wrap">
              <span className="hp-search-icon">🔍</span>
              <input className="hp-search" type="text" placeholder="Search by title, subject or description..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="hp-sort" value={sort} onChange={e => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="hp-filter-panel">
            <div className="hp-filter-row">
              <span className="hp-filter-label">Subject</span>
              <div className="hp-filter-chips">
                {SUBJECTS.map(s => <button key={s} className={`hp-chip${subject === s ? " active" : ""}`} onClick={() => setSubject(s)}>{s}</button>)}
              </div>
            </div>
            <div className="hp-filter-divider" />
            <div className="hp-filter-row">
              <span className="hp-filter-label">Type</span>
              <div className="hp-filter-chips">
                {TYPES.map(t => <button key={t} className={`hp-chip${type === t ? " active" : ""}`} onClick={() => setType(t)}>{t}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="hp-results-info">
          <span className="hp-results-count">Showing <strong>{filtered.length}</strong> of {resources.length} resources</span>
          {hasFilters && <button className="hp-clear-btn" onClick={clearFilters}>✕ Clear filters</button>}
        </div>

        <div className="hp-grid">
          {filtered.length === 0 ? (
            <div className="hp-empty">
              <div className="hp-empty-icon">🗂️</div>
              <p>No resources found. Try adjusting your search or filters.</p>
            </div>
          ) : filtered.map(r => (
            <div className="hp-card" key={r._id}>
              <div className="hp-card-top">
                <span className="hp-card-subject">{r.subject}</span>
                {r.type && <span className="hp-card-type">{r.type}</span>}
              </div>
              <h3>{r.title}</h3>
              <p className="hp-card-desc">{r.description}</p>

              <div className="hp-card-rating">
                <StarDisplay avg={r.avgRating || 0} count={r.ratingCount || 0} />
                <button className="hp-rating-toggle" onClick={() => setRatingOpen(r)}>★ Rate this</button>
              </div>

              <div className="hp-card-meta">
                <span>⬇️ {r.downloads || 0}</span>
                <span>👤 {r.uploadedBy?.name}</span>
              </div>
              <div className="hp-card-actions">
                <a className="hp-btn hp-btn-view" href={`http://localhost:5000/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer">👁 View</a>
                <a className="hp-btn hp-btn-dl"   href={`http://localhost:5000/api/resources/download/${r._id}`}>⬇ Download</a>
              </div>
            </div>
          ))}
        </div>

        {ratingOpen && (
          <div className="hp-rating-modal" onClick={() => setRatingOpen(null)}>
            <div className="hp-rating-box" onClick={e => e.stopPropagation()}>
              <div className="hp-rating-box-title">{ratingOpen.title}</div>
              <div className="hp-rating-box-sub">{ratingOpen.subject}</div>
              <StarRating
                resourceId={ratingOpen._id}
                avgRating={ratingOpen.avgRating || 0}
                ratingCount={ratingOpen.ratingCount || 0}
                onRated={() => { fetchResources(); setRatingOpen(null) }}
              />
              <button className="hp-rating-close" onClick={() => setRatingOpen(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage