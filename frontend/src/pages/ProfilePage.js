import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    min-height: 100vh;
    background: #0d1117;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
    padding-bottom: 72px;
  }
  .pp-root::before {
    content:'';
    position:fixed;inset:0;
    background: radial-gradient(ellipse 60% 40% at 20% 10%, rgba(79,142,247,0.09) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 80% 80%, rgba(99,102,241,0.07) 0%, transparent 70%);
    pointer-events:none;z-index:0;
  }

  /* HERO BANNER */
  .pp-banner {
    position: relative;
    z-index: 1;
    height: 160px;
    background: linear-gradient(135deg, #0d1b3e 0%, #1a1040 50%, #0d1b2a 100%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
  }
  .pp-banner::after {
    content:'';
    position:absolute;inset:0;
    background: radial-gradient(ellipse 80% 100% at 50% 100%, rgba(79,142,247,0.15) 0%, transparent 65%);
  }

  /* PROFILE SECTION */
  .pp-profile-wrap {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 28px;
  }
  .pp-avatar-row {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    transform: translateY(-36px);
    margin-bottom: -20px;
  }
  .pp-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f8ef7, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 900;
    color: #fff;
    border: 4px solid #0d1117;
    box-shadow: 0 4px 20px rgba(79,142,247,0.35);
    flex-shrink: 0;
    text-transform: uppercase;
  }
  .pp-name-block { padding-bottom: 6px; }
  .pp-name {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 900;
    color: #e6edf3;
  }
  .pp-email { font-size: 13px; color: #8b949e; margin-top: 3px; }

  /* STATS ROW */
  .pp-stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 20px;
    margin-bottom: 36px;
  }
  .pp-stat {
    flex: 1;
    min-width: 120px;
    background: #161b22;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: border-color 0.2s;
  }
  .pp-stat:hover { border-color: rgba(79,142,247,0.25); }
  .pp-stat-value {
    font-size: 26px;
    font-weight: 700;
    color: #e6edf3;
    line-height: 1;
  }
  .pp-stat-label { font-size: 12px; color: #8b949e; font-weight: 500; }
  .pp-stat-icon { font-size: 18px; margin-bottom: 4px; }

  /* SECTION DIVIDER */
  .pp-section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #4f8ef7;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .pp-section-title::after {
    content:''; flex:1; height:1px; background: rgba(79,142,247,0.2);
  }

  /* UPLOADS GRID (reused from MyUploads) */
  .pp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }
  .pp-card {
    background: #161b22;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 9px;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .pp-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(0,0,0,0.4);
    border-color: rgba(79,142,247,0.2);
    background: #1c2333;
  }
  .pp-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .pp-tag {
    font-size: 10px; font-weight: 600; letter-spacing: 0.07em;
    text-transform: uppercase; border-radius: 4px; padding: 3px 7px;
  }
  .pp-tag-subject { color: #4f8ef7; background: rgba(79,142,247,0.1); }
  .pp-tag-type    { color: #8b5cf6; background: rgba(139,92,246,0.1); }
  .pp-card h4 { font-size: 14px; font-weight: 600; color: #e6edf3; line-height: 1.4; }
  .pp-card-desc { font-size: 12px; color: #8b949e; line-height: 1.5; flex: 1; }
  .pp-card-meta {
    font-size: 11px; color: #484f58;
    padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; gap: 12px;
  }
  .pp-card-actions { display: flex; gap: 7px; margin-top: 2px; }
  .pp-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center;
    gap: 5px; padding: 7px 10px; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    text-decoration: none; cursor: pointer; border: none; transition: all 0.18s;
  }
  .pp-btn-view     { background: rgba(79,142,247,0.1); color: #4f8ef7; border: 1px solid rgba(79,142,247,0.2); }
  .pp-btn-view:hover { background: #4f8ef7; color: #fff; border-color: #4f8ef7; }
  .pp-btn-dl       { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
  .pp-btn-dl:hover { background: #10b981; color: #fff; border-color: #10b981; }
  .pp-btn-del      { flex: 0 0 auto; padding: 7px 11px; background: rgba(239,68,68,0.08); color: #f87171; border: 1px solid rgba(239,68,68,0.18); }
  .pp-btn-del:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

  /* CONFIRM MODAL */
  .pp-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px); display: flex; align-items: center;
    justify-content: center; z-index: 100; padding: 20px;
    animation: pp-fade 0.18s ease;
  }
  @keyframes pp-fade { from{opacity:0} to{opacity:1} }
  .pp-confirm {
    background: #161b22; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 32px 28px; max-width: 340px; width: 100%;
    text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.6);
    animation: pp-pop 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes pp-pop { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
  .pp-confirm-icon { font-size: 34px; margin-bottom: 12px; }
  .pp-confirm-title { font-family:'Playfair Display',serif; font-size:19px; font-weight:700; color:#e6edf3; margin-bottom:8px; }
  .pp-confirm-sub   { font-size:13px; color:#8b949e; margin-bottom:22px; line-height:1.55; }
  .pp-confirm-btns  { display:flex; gap:10px; }
  .pp-confirm-cancel {
    flex:1; padding:10px; background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1); border-radius:8px;
    color:#8b949e; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
  }
  .pp-confirm-cancel:hover { background:rgba(255,255,255,0.09); color:#e6edf3; }
  .pp-confirm-del {
    flex:1; padding:10px; background:#ef4444; border:none; border-radius:8px;
    color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(239,68,68,0.3);
  }
  .pp-confirm-del:hover { background:#dc2626; }

  /* EMPTY */
  .pp-empty { text-align:center; padding:60px 20px; color:#484f58; }
  .pp-empty-icon { font-size:44px; margin-bottom:14px; }
  .pp-empty-title { font-family:'Playfair Display',serif; font-size:18px; color:#8b949e; margin-bottom:6px; }
  .pp-empty-sub   { font-size:13px; }
  .pp-upload-btn {
    display:inline-flex; align-items:center; gap:6px; margin-top:16px;
    padding:10px 22px; background:linear-gradient(135deg,#4f8ef7,#6366f1);
    color:#fff; border-radius:9px; text-decoration:none;
    font-size:14px; font-weight:600; transition:opacity 0.18s;
    box-shadow:0 4px 14px rgba(79,142,247,0.3);
  }
  .pp-upload-btn:hover { opacity:0.88; }

  @media (max-width:600px) {
    .pp-profile-wrap { padding:0 14px; }
    .pp-stats { gap:8px; }
    .pp-stat { min-width:100px; padding:12px 14px; }
    .pp-grid { grid-template-columns:1fr; }
  }
`

function ProfilePage() {
  const [user, setUser]         = useState(null)
  const [resources, setResources] = useState([])
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting]   = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchUploads()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      setUser(res.data)
    } catch (err) { console.log(err) }
  }

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await API.get("/resources/my", { headers: { Authorization: `Bearer ${token}` } })
      setResources(res.data)
    } catch (err) { console.log(err) }
  }

  const deleteResource = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      const token = localStorage.getItem("token")
      await API.delete(`/resources/${confirmId}`, { headers: { Authorization: `Bearer ${token}` } })
      setResources(resources.filter(r => r._id !== confirmId))
      setConfirmId(null)
    } catch (err) { console.log(err) }
    finally { setDeleting(false) }
  }

  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0)
  const initials = user?.name ? user.name.trim()[0].toUpperCase() : "?"

  return (
    <>
      <style>{styles}</style>
      <div className="pp-root">

        {/* Banner */}
        <div className="pp-banner" />

        <div className="pp-profile-wrap">

          {/* Avatar + name */}
          <div className="pp-avatar-row">
            <div className="pp-avatar">{initials}</div>
            <div className="pp-name-block">
              <div className="pp-name">{user?.name || "Loading..."}</div>
              <div className="pp-email">{user?.email || ""}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="pp-stats">
            {[
              { icon: "📤", value: resources.length, label: "Uploads" },
              { icon: "⬇️", value: totalDownloads,   label: "Total Downloads" },
              { icon: "📚", value: new Set(resources.map(r => r.subject)).size, label: "Subjects Covered" },
            ].map(s => (
              <div className="pp-stat" key={s.label}>
                <div className="pp-stat-icon">{s.icon}</div>
                <div className="pp-stat-value">{s.value}</div>
                <div className="pp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Uploads section */}
          <div className="pp-section-title">My uploaded resources</div>

          {resources.length === 0 ? (
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
                    <span>⬇️ {r.downloads} downloads</span>
                  </div>
                  <div className="pp-card-actions">
                    <a className="pp-btn pp-btn-view" href={`http://localhost:5000/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer">👁 View</a>
                    <a className="pp-btn pp-btn-dl"   href={`http://localhost:5000/api/resources/download/${r._id}`}>⬇ Download</a>
                    <button className="pp-btn pp-btn-del" onClick={() => setConfirmId(r._id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete confirm */}
        {confirmId && (
          <div className="pp-overlay" onClick={() => setConfirmId(null)}>
            <div className="pp-confirm" onClick={e => e.stopPropagation()}>
              <div className="pp-confirm-icon">🗑️</div>
              <div className="pp-confirm-title">Delete resource?</div>
              <div className="pp-confirm-sub">This action cannot be undone. The file will be permanently removed.</div>
              <div className="pp-confirm-btns">
                <button className="pp-confirm-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
                <button className="pp-confirm-del"    onClick={deleteResource} disabled={deleting}>{deleting ? "Deleting…" : "Yes, delete"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProfilePage