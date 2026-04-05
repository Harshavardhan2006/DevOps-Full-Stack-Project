import { useEffect, useState } from "react"
import API from "../services/api"
import "../styles/styles.css"

function AdminDashboard() {
  const [users,       setUsers]       = useState([])
  const [resources,   setResources]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState("")
  const [confirmId,   setConfirmId]   = useState(null)
  const [confirmType, setConfirmType] = useState(null)
  const [deleting,    setDeleting]    = useState(false)
  const [tab,         setTab]         = useState("resources")

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    setError("")
    try {
      const [uRes, rRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/resources"),
      ])
      setUsers(uRes.data)
      setResources(rRes.data)
    } catch (err) {
      console.log(err)
      setError("Failed to load dashboard data. Make sure you are logged in as admin.")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (id, type) => { setConfirmId(id); setConfirmType(type) }

  const handleDelete = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      if (confirmType === "resource") {
        await API.delete(`/resources/${confirmId}`)
        setResources(prev => prev.filter(r => r._id !== confirmId))
      } else {
        await API.delete(`/admin/users/${confirmId}`)
        setUsers(prev => prev.filter(u => u._id !== confirmId))
      }
      setConfirmId(null)
    } catch (err) {
      console.log(err)
      // FIX: show error instead of silently failing
      setError(`Failed to delete ${confirmType}. Please try again.`)
      setConfirmId(null)
    } finally {
      setDeleting(false)
    }
  }

  const subjectMap = resources.reduce((acc, r) => {
    if (r.subject) acc[r.subject] = (acc[r.subject] || 0) + 1
    return acc
  }, {})
  const subjectList  = Object.entries(subjectMap).sort((a, b) => b[1] - a[1])
  const maxSubjCount = subjectList[0]?.[1] || 1

  const dlBySubject = resources.reduce((acc, r) => {
    if (r.subject) acc[r.subject] = (acc[r.subject] || 0) + (r.downloads || 0)
    return acc
  }, {})
  const dlBars = Object.entries(dlBySubject).sort((a, b) => b[1] - a[1]).slice(0, 7)
  const maxDl  = dlBars[0]?.[1] || 1

  const tabBtnStyle = (t) => ({
    padding: "8px 20px", border: "none", borderRadius: "8px", cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600,
    background: tab === t ? "#4f8ef7" : "rgba(255,255,255,0.05)",
    color: tab === t ? "#fff" : "#8b949e",
    transition: "all 0.18s", textTransform: "capitalize",
  })

  return (
    <div className="ad-root">

      <div className="ad-header">
        <div className="ad-header-left">
          <div className="ad-header-icon">🛡️</div>
          <div>
            <h1>Admin Dashboard</h1>
            <div className="ad-header-sub">Platform overview and management</div>
          </div>
        </div>
        <span className="ad-admin-badge">Admin</span>
      </div>

      <div className="ad-content">

        {error && (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171", padding:"12px 16px", borderRadius:"10px", marginBottom:"24px", fontSize:"14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>⚠ {error}</span>
            <button onClick={() => setError("")} style={{ background:"none", border:"none", color:"#f87171", cursor:"pointer", fontSize:"16px" }}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="ad-empty">Loading dashboard...</div>
        ) : (
          <>
            <div className="ad-section">Overview</div>
            <div className="ad-stats">
              {[
                { icon: "👥", value: users.length,     label: "Total Users"      },
                { icon: "📚", value: resources.length, label: "Total Resources"  },
                { icon: "⬇️", value: resources.reduce((s, r) => s + (r.downloads || 0), 0), label: "Total Downloads" },
                { icon: "⭐", value: resources.filter(r => (r.avgRating || 0) > 0).length, label: "Rated Resources" },
              ].map(s => (
                <div className="ad-stat" key={s.label}>
                  <div className="ad-stat-icon">{s.icon}</div>
                  <div className="ad-stat-value">{s.value}</div>
                  <div className="ad-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="ad-two-col">
              <div className="ad-chart-wrap">
                <div className="ad-chart-title">Downloads by subject</div>
                {dlBars.length === 0 ? (
                  <div className="ad-empty">No download data yet</div>
                ) : (
                  <div className="ad-bars">
                    {dlBars.map(([subj, dl]) => (
                      <div className="ad-bar-wrap" key={subj}>
                        <div className="ad-bar-val">{dl}</div>
                        <div
                          className="ad-bar"
                          style={{ height: `${Math.max(8, (dl / maxDl) * 96)}px` }}
                          title={`${subj}: ${dl} downloads`}
                        />
                        <div className="ad-bar-label">{subj.split(" ")[0]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="ad-chart-wrap">
                <div className="ad-chart-title">Resources by subject</div>
                {subjectList.length === 0 ? (
                  <div className="ad-empty">No resources yet</div>
                ) : (
                  <div className="ad-subject-bars">
                    {subjectList.slice(0, 7).map(([subj, count]) => (
                      <div className="ad-subj-row" key={subj}>
                        <div className="ad-subj-label-row">
                          <span className="ad-subj-name">{subj}</span>
                          <span className="ad-subj-count">{count}</span>
                        </div>
                        <div className="ad-subj-track">
                          <div
                            className="ad-subj-fill"
                            style={{ width: `${(count / maxSubjCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {["resources","users"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={tabBtnStyle(t)}>{t}</button>
              ))}
            </div>

            {tab === "resources" && (
              <div className="ad-table-wrap">
                <div className="ad-table-header">
                  <span className="ad-table-title">All Resources</span>
                  <span className="ad-table-count">{resources.length} total</span>
                </div>
                {resources.length === 0 ? (
                  <div className="ad-empty">No resources uploaded yet</div>
                ) : (
                  <div style={{ overflowX:"auto" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Subject</th>
                          <th>Type</th>
                          <th>Uploaded by</th>
                          <th>Downloads</th>
                          <th>Rating</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map(r => (
                          <tr key={r._id}>
                            <td style={{ fontWeight:500, maxWidth:200, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                              {r.title}
                            </td>
                            <td><span className="ad-badge ad-badge-subject">{r.subject}</span></td>
                            <td><span className="ad-badge ad-badge-type">{r.type || "—"}</span></td>
                            {/* FIX: safe access — uploader may be null if user was deleted */}
                            <td style={{ color:"#8b949e" }}>{r.uploadedBy?.name || "Deleted user"}</td>
                            <td style={{ color:"#8b949e" }}>{r.downloads || 0}</td>
                            <td style={{ color:"#f59e0b" }}>
                              {(r.avgRating || 0) > 0 ? `⭐ ${r.avgRating.toFixed(1)}` : "—"}
                            </td>
                            <td>
                              <button
                                className="ad-del-btn"
                                onClick={() => confirmDelete(r._id, "resource")}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === "users" && (
              <div className="ad-table-wrap">
                <div className="ad-table-header">
                  <span className="ad-table-title">All Users</span>
                  <span className="ad-table-count">{users.length} total</span>
                </div>
                {users.length === 0 ? (
                  <div className="ad-empty">No users found</div>
                ) : (
                  <div style={{ overflowX:"auto" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Uploads</th>
                          <th>Joined</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id}>
                            <td>
                              <div className="ad-user-cell">
                                <div className="ad-user-avatar">
                                  {u.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                  <div className="ad-user-name">{u.name}</div>
                                  <div className="ad-user-email">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`ad-badge ${u.role === "admin" ? "ad-badge-admin" : "ad-badge-user"}`}>
                                {u.role || "student"}
                              </span>
                            </td>
                            <td style={{ color:"#8b949e" }}>
                              {resources.filter(r =>
                                r.uploadedBy?._id === u._id ||
                                r.uploadedBy === u._id
                              ).length}
                            </td>
                            <td style={{ color:"#8b949e", fontSize:12 }}>
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
                                : "—"
                              }
                            </td>
                            <td>
                              {u.role !== "admin" && (
                                <button
                                  className="ad-del-btn"
                                  onClick={() => confirmDelete(u._id, "user")}
                                >
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {confirmId && (
        <div className="ad-overlay" onClick={() => setConfirmId(null)}>
          <div className="ad-confirm" onClick={e => e.stopPropagation()}>
            <div className="ad-confirm-icon">{confirmType === "user" ? "👤" : "🗑️"}</div>
            <div className="ad-confirm-title">
              {confirmType === "user" ? "Remove user?" : "Delete resource?"}
            </div>
            <div className="ad-confirm-sub">
              This action cannot be undone and will permanently remove the {confirmType}.
            </div>
            <div className="ad-confirm-btns">
              <button
                className="ad-cancel"
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="ad-delete"
                onClick={handleDelete}
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

export default AdminDashboard