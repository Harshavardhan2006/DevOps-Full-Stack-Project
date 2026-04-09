import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import "../styles/styles.css"

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const getViewUrl = (fileUrl) => {
  if (!fileUrl) return "#"
  const lower = fileUrl.toLowerCase()
  const isOffice = lower.includes(".doc") || lower.includes(".ppt") || lower.includes(".xls")
  if (isOffice) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`
  }
  return fileUrl
}

function ProfilePage() {
  const [user,      setUser]      = useState(null)
  const [resources, setResources] = useState([])
  const [confirmId, setConfirmId] = useState(null)
  const [deleting,  setDeleting]  = useState(false)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [userRes, uploadsRes] = await Promise.all([
        API.get("/auth/me"),
        API.get("/resources/my"),
      ])
      setUser(userRes.data)
      setResources(uploadsRes.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteResource = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      await API.delete(`/resources/${confirmId}`)
      setResources(prev => prev.filter(r => r._id !== confirmId))
      setConfirmId(null)
    } catch (err) {
      console.log(err)
    } finally {
      setDeleting(false)
    }
  }

  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0)
  const initials = user?.name ? user.name.trim()[0].toUpperCase() : "?"

  return (
    <div className="pp-root">

      <div className="pp-banner" />

      <div className="pp-profile-wrap">

        <div className="pp-avatar-row">
          <div className="pp-avatar">{initials}</div>
          <div className="pp-name-block">
            <div className="pp-name">{user?.name || (loading ? "Loading..." : "Unknown")}</div>
            <div className="pp-email">{user?.email || ""}</div>
          </div>
        </div>

        <div className="pp-stats">
          {[
            { icon: "📤", value: resources.length,   label: "Uploads" },
            { icon: "⬇️", value: totalDownloads,     label: "Total Downloads" },
            { icon: "📚", value: new Set(resources.map(r => r.subject)).size, label: "Subjects Covered" },
          ].map(s => (
            <div className="pp-stat" key={s.label}>
              <div className="pp-stat-icon">{s.icon}</div>
              <div className="pp-stat-value">{s.value}</div>
              <div className="pp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="pp-section-title">My uploaded resources</div>

        {loading ? (
          <div className="pp-empty">
            <div className="pp-empty-sub">Loading your resources...</div>
          </div>
        ) : resources.length === 0 ? (
          <div className="pp-empty">
            <div className="pp-empty-icon">🗂️</div>
            <div className="pp-empty-title">No uploads yet</div>
            <div className="pp-empty-sub">Share your first resource with fellow students.</div>
            <Link to="/upload" className="pp-upload-btn">📤 Upload Now</Link>
          </div>
        ) : (
          <div className="pp-grid">
            {resources.map(r => (
              <div className="pp-card" key={r._id}>
                <div className="pp-card-tags">
                  <span className="pp-tag pp-tag-subject">{r.subject}</span>
                  {r.type && <span className="pp-tag pp-tag-type">{r.type}</span>}
                </div>
                <h4>{r.title}</h4>
                <p className="pp-card-desc">{r.description}</p>
                <div className="pp-card-meta">
                  <span>⬇️ {r.downloads || 0} downloads</span>
                </div>
                <div className="pp-card-actions">
                  <a
                    className="pp-btn pp-btn-view"
                    href={getViewUrl(r.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    👁 View
                  </a>
                  <a
                    className="pp-btn pp-btn-dl"
                    href={`${API_BASE}/resources/download/${r._id}`}
                  >
                    ⬇ Download
                  </a>
                  <button
                    className="pp-btn pp-btn-del"
                    onClick={() => setConfirmId(r._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmId && (
        <div className="pp-overlay" onClick={() => setConfirmId(null)}>
          <div className="pp-confirm" onClick={e => e.stopPropagation()}>
            <div className="pp-confirm-icon">🗑️</div>
            <div className="pp-confirm-title">Delete resource?</div>
            <div className="pp-confirm-sub">
              This action cannot be undone. The file will be permanently removed.
            </div>
            <div className="pp-confirm-btns">
              <button
                className="pp-confirm-cancel"
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="pp-confirm-del"
                onClick={deleteResource}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage