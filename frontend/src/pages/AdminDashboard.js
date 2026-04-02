import { useEffect, useState } from "react"
import API from "../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ad-root {
    min-height: 100vh; background: #0d1117;
    font-family: 'DM Sans', sans-serif; color: #e6edf3; padding-bottom: 72px;
  }
  .ad-root::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
    background: radial-gradient(ellipse 60% 40% at 5% 10%, rgba(79,142,247,0.08) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 95% 85%, rgba(139,92,246,0.07) 0%, transparent 70%);
  }

  .ad-header {
    position:relative; z-index:1;
    border-bottom:1px solid rgba(255,255,255,0.06);
    padding:40px 40px 32px;
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
  }
  .ad-header-left { display:flex; align-items:center; gap:14px; }
  .ad-header-icon {
    width:46px; height:46px; border-radius:12px;
    background:linear-gradient(135deg,#4f8ef7,#6366f1);
    display:flex; align-items:center; justify-content:center; font-size:22px;
    box-shadow:0 4px 14px rgba(79,142,247,0.3); flex-shrink:0;
  }
  .ad-header h1 { font-family:'Playfair Display',serif; font-size:clamp(20px,3vw,28px); font-weight:900; color:#e6edf3; }
  .ad-header-sub { font-size:13px; color:#8b949e; margin-top:2px; }
  .ad-admin-badge {
    background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
    color:#f87171; font-size:11px; font-weight:700; letter-spacing:0.08em;
    text-transform:uppercase; padding:5px 14px; border-radius:999px;
  }

  .ad-content { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:32px 28px 0; }

  .ad-section {
    font-size:11px; font-weight:600; letter-spacing:0.09em; text-transform:uppercase;
    color:#4f8ef7; display:flex; align-items:center; gap:10px; margin-bottom:16px;
  }
  .ad-section::after { content:''; flex:1; height:1px; background:rgba(79,142,247,0.2); }

  .ad-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:14px; margin-bottom:36px; }
  .ad-stat {
    background:#161b22; border:1px solid rgba(255,255,255,0.07); border-radius:14px;
    padding:20px; display:flex; flex-direction:column; gap:6px;
    transition:border-color 0.2s, transform 0.2s;
  }
  .ad-stat:hover { border-color:rgba(79,142,247,0.25); transform:translateY(-2px); }
  .ad-stat-icon { font-size:20px; }
  .ad-stat-value { font-size:28px; font-weight:700; color:#e6edf3; line-height:1; }
  .ad-stat-label { font-size:12px; color:#8b949e; font-weight:500; }

  .ad-chart-wrap {
    background:#161b22; border:1px solid rgba(255,255,255,0.07); border-radius:14px;
    padding:22px; margin-bottom:36px;
  }
  .ad-chart-title { font-size:14px; font-weight:600; color:#e6edf3; margin-bottom:18px; }
  .ad-bars { display:flex; align-items:flex-end; gap:10px; height:120px; }
  .ad-bar-wrap { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; min-width:0; }
  .ad-bar {
    width:100%; border-radius:5px 5px 0 0;
    background:linear-gradient(180deg,#4f8ef7,#6366f1);
    transition:height 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.2s;
    min-height:4px;
  }
  .ad-bar:hover { opacity:0.8; cursor:pointer; }
  .ad-bar-label { font-size:10px; color:#8b949e; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; }
  .ad-bar-val { font-size:11px; font-weight:600; color:#e6edf3; }

  .ad-two-col { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:36px; }

  .ad-table-wrap {
    background:#161b22; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden;
  }
  .ad-table-header {
    padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.06);
    display:flex; align-items:center; justify-content:space-between;
  }
  .ad-table-title { font-size:14px; font-weight:600; color:#e6edf3; }
  .ad-table-count { font-size:12px; color:#8b949e; }
  table { width:100%; border-collapse:collapse; }
  th {
    text-align:left; padding:10px 20px; font-size:11px; font-weight:600;
    letter-spacing:0.07em; text-transform:uppercase; color:#8b949e;
    border-bottom:1px solid rgba(255,255,255,0.06); background:#0f141a;
  }
  td { padding:12px 20px; font-size:13px; color:#e6edf3; border-bottom:1px solid rgba(255,255,255,0.04); }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(255,255,255,0.02); }

  .ad-user-cell { display:flex; align-items:center; gap:10px; }
  .ad-user-avatar {
    width:30px; height:30px; border-radius:50%;
    background:linear-gradient(135deg,#4f8ef7,#6366f1);
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; color:#fff; flex-shrink:0; text-transform:uppercase;
  }
  .ad-user-name  { font-weight:500; color:#e6edf3; font-size:13px; }
  .ad-user-email { font-size:11px; color:#8b949e; }

  .ad-badge {
    display:inline-block; font-size:10px; font-weight:700; letter-spacing:0.06em;
    text-transform:uppercase; padding:3px 8px; border-radius:4px;
  }
  .ad-badge-subject { color:#4f8ef7; background:rgba(79,142,247,0.1); }
  .ad-badge-type    { color:#8b5cf6; background:rgba(139,92,246,0.1); }
  .ad-badge-admin   { color:#f59e0b; background:rgba(245,158,11,0.1); }
  .ad-badge-user    { color:#10b981; background:rgba(16,185,129,0.1); }

  .ad-del-btn {
    padding:5px 10px; background:rgba(239,68,68,0.08);
    border:1px solid rgba(239,68,68,0.18); border-radius:6px;
    color:#f87171; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; transition:all 0.18s;
  }
  .ad-del-btn:hover { background:#ef4444; color:#fff; border-color:#ef4444; }

  .ad-subject-bars { display:flex; flex-direction:column; gap:10px; padding:4px 0; }
  .ad-subj-row { display:flex; flex-direction:column; gap:4px; }
  .ad-subj-label-row { display:flex; justify-content:space-between; font-size:12px; }
  .ad-subj-name  { color:#e6edf3; font-weight:500; }
  .ad-subj-count { color:#8b949e; }
  .ad-subj-track { height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
  .ad-subj-fill  { height:100%; border-radius:3px; background:linear-gradient(90deg,#4f8ef7,#6366f1); transition:width 0.6s cubic-bezier(0.22,1,0.36,1); }

  .ad-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; z-index:100; padding:20px;
    animation:ad-fade 0.18s ease;
  }
  @keyframes ad-fade { from{opacity:0} to{opacity:1} }
  .ad-confirm {
    background:#161b22; border:1px solid rgba(255,255,255,0.1); border-radius:16px;
    padding:30px 26px; max-width:340px; width:100%; text-align:center;
    box-shadow:0 24px 64px rgba(0,0,0,0.6); animation:ad-pop 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes ad-pop { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
  .ad-confirm-icon  { font-size:32px; margin-bottom:12px; }
  .ad-confirm-title { font-family:'Playfair Display',serif; font-size:19px; font-weight:700; color:#e6edf3; margin-bottom:8px; }
  .ad-confirm-sub   { font-size:13px; color:#8b949e; margin-bottom:22px; line-height:1.55; }
  .ad-confirm-btns  { display:flex; gap:10px; }
  .ad-cancel { flex:1; padding:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#8b949e; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s; }
  .ad-cancel:hover { background:rgba(255,255,255,0.09); color:#e6edf3; }
  .ad-delete { flex:1; padding:10px; background:#ef4444; border:none; border-radius:8px; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s; box-shadow:0 4px 14px rgba(239,68,68,0.3); }
  .ad-delete:hover { background:#dc2626; }

  .ad-empty { text-align:center; padding:40px 20px; color:#484f58; font-size:14px; }

  @media (max-width:760px) {
    .ad-header { padding:28px 16px 22px; }
    .ad-content { padding:20px 14px 0; }
    .ad-two-col { grid-template-columns:1fr; }
    .ad-stats { grid-template-columns:1fr 1fr; }
    th, td { padding:10px 12px; }
  }
`

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
        setResources(resources.filter(r => r._id !== confirmId))
      } else {
        await API.delete(`/admin/users/${confirmId}`)
        setUsers(users.filter(u => u._id !== confirmId))
      }
      setConfirmId(null)
    } catch (err) { console.log(err) }
    finally { setDeleting(false) }
  }

  const subjectMap = resources.reduce((acc, r) => {
    acc[r.subject] = (acc[r.subject] || 0) + 1
    return acc
  }, {})
  const subjectList  = Object.entries(subjectMap).sort((a, b) => b[1] - a[1])
  const maxSubjCount = subjectList[0]?.[1] || 1

  const dlBySubject = resources.reduce((acc, r) => {
    acc[r.subject] = (acc[r.subject] || 0) + (r.downloads || 0)
    return acc
  }, {})
  const dlBars = Object.entries(dlBySubject).sort((a, b) => b[1] - a[1]).slice(0, 7)
  const maxDl  = dlBars[0]?.[1] || 1

  return (
    <>
      <style>{styles}</style>
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
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171", padding:"12px 16px", borderRadius:"10px", marginBottom:"24px", fontSize:"14px" }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div className="ad-empty">Loading dashboard...</div>
          ) : (
            <>
              {/* STAT CARDS */}
              <div className="ad-section">Overview</div>
              <div className="ad-stats">
                {[
                  { icon:"👥", value: users.length,     label:"Total Users" },
                  { icon:"📚", value: resources.length, label:"Total Resources" },
                  { icon:"⬇️", value: resources.reduce((s, r) => s + (r.downloads || 0), 0), label:"Total Downloads" },
                  { icon:"⭐", value: resources.filter(r => r.avgRating > 0).length, label:"Rated Resources" },
                ].map(s => (
                  <div className="ad-stat" key={s.label}>
                    <div className="ad-stat-icon">{s.icon}</div>
                    <div className="ad-stat-value">{s.value}</div>
                    <div className="ad-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* CHARTS */}
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
                          <div className="ad-bar" style={{ height:`${Math.max(8, (dl / maxDl) * 96)}px` }} />
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
                            <div className="ad-subj-fill" style={{ width:`${(count / maxSubjCount) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* TABS */}
              <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                {["resources", "users"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    padding:"8px 20px", border:"none", borderRadius:"8px", cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
                    background: tab === t ? "#4f8ef7" : "rgba(255,255,255,0.05)",
                    color: tab === t ? "#fff" : "#8b949e",
                    transition:"all 0.18s", textTransform:"capitalize",
                  }}>{t}</button>
                ))}
              </div>

              {/* RESOURCES TABLE */}
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
                            <th>Title</th><th>Subject</th><th>Type</th>
                            <th>Uploaded by</th><th>Downloads</th><th>Rating</th><th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {resources.map(r => (
                            <tr key={r._id}>
                              <td style={{ fontWeight:500, maxWidth:200, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.title}</td>
                              <td><span className="ad-badge ad-badge-subject">{r.subject}</span></td>
                              <td><span className="ad-badge ad-badge-type">{r.type}</span></td>
                              <td style={{ color:"#8b949e" }}>{r.uploadedBy?.name || "—"}</td>
                              <td style={{ color:"#8b949e" }}>{r.downloads || 0}</td>
                              <td style={{ color:"#f59e0b" }}>{r.avgRating > 0 ? `⭐ ${r.avgRating.toFixed(1)}` : "—"}</td>
                              <td><button className="ad-del-btn" onClick={() => confirmDelete(r._id, "resource")}>Delete</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* USERS TABLE */}
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
                            <th>User</th><th>Role</th><th>Uploads</th><th>Joined</th><th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u._id}>
                              <td>
                                <div className="ad-user-cell">
                                  <div className="ad-user-avatar">{u.name?.[0] || "?"}</div>
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
                                {resources.filter(r => r.uploadedBy?._id === u._id || r.uploadedBy === u._id).length}
                              </td>
                              <td style={{ color:"#8b949e", fontSize:12 }}>
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                              </td>
                              <td>
                                {u.role !== "admin" && (
                                  <button className="ad-del-btn" onClick={() => confirmDelete(u._id, "user")}>Remove</button>
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

        {/* Delete confirm modal */}
        {confirmId && (
          <div className="ad-overlay" onClick={() => setConfirmId(null)}>
            <div className="ad-confirm" onClick={e => e.stopPropagation()}>
              <div className="ad-confirm-icon">{confirmType === "user" ? "👤" : "🗑️"}</div>
              <div className="ad-confirm-title">{confirmType === "user" ? "Remove user?" : "Delete resource?"}</div>
              <div className="ad-confirm-sub">This action cannot be undone and will permanently remove the {confirmType}.</div>
              <div className="ad-confirm-btns">
                <button className="ad-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
                <button className="ad-delete" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "Yes, delete"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminDashboard