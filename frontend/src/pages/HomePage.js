import { useEffect, useState, useMemo } from "react"
import API from "../services/api"
import { StarDisplay } from "../components/StarRating"
import StarRating from "../components/StarRating"
import "../styles/styles.css"

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const getViewUrl = (fileUrl) => {
  if (!fileUrl) return "#"
  const lower = fileUrl.toLowerCase()
  const isOffice = lower.includes(".doc") || lower.includes(".ppt") || lower.includes(".xls")
  if (isOffice) return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`
  return fileUrl
}

const TYPES = ["All", "Notes", "Assignment", "Question Paper"]
const SORTS = [
  { value: "newest",    label: "Newest first"   },
  { value: "oldest",    label: "Oldest first"   },
  { value: "downloads", label: "Most downloaded" },
  { value: "rating",    label: "Highest rated"  },
  { value: "title",     label: "A → Z"          },
]

function HomePage() {
  const [resources,  setResources]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")
  const [subject,    setSubject]    = useState("All")
  const [type,       setType]       = useState("All")
  const [sort,       setSort]       = useState("newest")
  const [ratingOpen, setRatingOpen] = useState(null)

  useEffect(() => { fetchResources() }, [])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const res = await API.get("/resources")
      setResources(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Build subject list dynamically from actual resources — includes any custom subjects
  const allSubjects = useMemo(() => {
    const fromResources = resources.map(r => r.subject).filter(Boolean)
    const unique = ["All", ...new Set(fromResources)].sort((a, b) => {
      if (a === "All") return -1
      if (b === "All") return  1
      return a.localeCompare(b)
    })
    return unique
  }, [resources])

  const hasFilters = search || subject !== "All" || type !== "All" || sort !== "newest"

  const clearFilters = () => {
    setSearch("")
    setSubject("All")
    setType("All")
    setSort("newest")
  }

  const filtered = useMemo(() => {
    let list = resources.filter(r => {
      const q = search.toLowerCase()
      const matchSearch  = !q
        || r.title?.toLowerCase().includes(q)
        || r.description?.toLowerCase().includes(q)
        || r.subject?.toLowerCase().includes(q)
      const matchSubject = subject === "All" || r.subject === subject
      const matchType    = type    === "All" || r.type    === type
      return matchSearch && matchSubject && matchType
    })
    return [...list].sort((a, b) => {
      if (sort === "newest")    return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === "oldest")    return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === "downloads") return (b.downloads || 0) - (a.downloads || 0)
      if (sort === "rating")    return (b.avgRating  || 0) - (a.avgRating  || 0)
      if (sort === "title")     return (a.title || "").localeCompare(b.title || "")
      return 0
    })
  }, [resources, search, subject, type, sort])

  const handleRated = (resourceId, newAvg, newCount) => {
    setResources(prev => prev.map(r =>
      r._id === resourceId
        ? { ...r, avgRating: newAvg, ratingCount: newCount }
        : r
    ))
    setRatingOpen(null)
  }

  return (
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
            <input
              className="hp-search"
              type="text"
              placeholder="Search by title, subject or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="hp-sort" value={sort} onChange={e => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="hp-filter-panel">
          <div className="hp-filter-row">
            <span className="hp-filter-label">Subject</span>
            <div className="hp-filter-chips">
              {allSubjects.map(s => (
                <button
                  key={s}
                  className={`hp-chip${subject === s ? " active" : ""}`}
                  onClick={() => setSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="hp-filter-divider" />
          <div className="hp-filter-row">
            <span className="hp-filter-label">Type</span>
            <div className="hp-filter-chips">
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`hp-chip${type === t ? " active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hp-results-info">
        <span className="hp-results-count">
          {loading
            ? "Loading resources..."
            : <>Showing <strong>{filtered.length}</strong> of {resources.length} resources</>
          }
        </span>
        {hasFilters && !loading && (
          <button className="hp-clear-btn" onClick={clearFilters}>✕ Clear filters</button>
        )}
      </div>

      <div className="hp-grid">
        {loading ? (
          <div className="hp-empty">
            <div className="hp-empty-icon">⏳</div>
            <p>Loading resources...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="hp-empty">
            <div className="hp-empty-icon">🗂️</div>
            <p>No resources found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          filtered.map(r => (
            <div className="hp-card" key={r._id}>
              <div className="hp-card-top">
                <span className="hp-card-subject">{r.subject}</span>
                {r.type && <span className="hp-card-type">{r.type}</span>}
              </div>
              <h3>{r.title}</h3>
              <p className="hp-card-desc">{r.description}</p>

              <div className="hp-card-rating">
                <StarDisplay avg={r.avgRating || 0} count={r.ratingCount || 0} />
                <button className="hp-rating-toggle" onClick={() => setRatingOpen(r)}>
                  ★ Rate this
                </button>
              </div>

              <div className="hp-card-meta">
                <span>⬇️ {r.downloads || 0}</span>
                <span>👤 {r.uploadedBy?.name || "Unknown"}</span>
              </div>
              <div className="hp-card-actions">
                <a
                  className="hp-btn hp-btn-view"
                  href={getViewUrl(r.fileUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  👁 View
                </a>
                <a
                  className="hp-btn hp-btn-dl"
                  href={`${API_BASE}/resources/download/${r._id}`}
                >
                  ⬇ Download
                </a>
              </div>
            </div>
          ))
        )}
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
              onRated={(avg, count) => handleRated(ratingOpen._id, avg, count)}
            />
            <button className="hp-rating-close" onClick={() => setRatingOpen(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage