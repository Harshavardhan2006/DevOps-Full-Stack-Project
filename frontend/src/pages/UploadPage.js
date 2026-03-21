import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .up-root {
    min-height: 100vh;
    background: #0d1117;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-family: 'DM Sans', sans-serif;
    padding: 48px 16px 64px;
  }

  .up-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(79,142,247,0.1) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 70%, rgba(99,102,241,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .up-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 520px;
    background: rgba(22, 27, 34, 0.95);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 44px 40px 40px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    animation: up-slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes up-slide-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Header */
  .up-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
  }
  .up-header-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #4f8ef7, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(79,142,247,0.3);
  }
  .up-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 900;
    color: #e6edf3;
    line-height: 1.2;
  }
  .up-header-sub {
    font-size: 13px;
    color: #8b949e;
    margin-top: 2px;
  }

  /* Section label */
  .up-section {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #4f8ef7;
    margin-bottom: 14px;
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .up-section::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(79,142,247,0.2);
  }
  .up-section:first-of-type { margin-top: 0; }

  /* Field */
  .up-field {
    margin-bottom: 14px;
  }
  .up-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8b949e;
    margin-bottom: 7px;
  }
  .up-input-wrap {
    position: relative;
  }
  .up-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    pointer-events: none;
    opacity: 0.45;
  }
  .up-input, .up-textarea, .up-select {
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
    appearance: none;
    -webkit-appearance: none;
  }
  .up-input::placeholder,
  .up-textarea::placeholder { color: #484f58; }
  .up-input:focus,
  .up-textarea:focus,
  .up-select:focus {
    border-color: rgba(79,142,247,0.55);
    background: rgba(79,142,247,0.05);
    box-shadow: 0 0 0 3px rgba(79,142,247,0.1);
  }
  .up-textarea {
    resize: vertical;
    min-height: 90px;
    padding-top: 11px;
    line-height: 1.55;
  }
  .up-select {
    cursor: pointer;
    color: #e6edf3;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b949e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .up-select option {
    background: #1c2333;
    color: #e6edf3;
  }

  /* Two-col row */
  .up-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* File drop zone */
  .up-dropzone {
    border: 1.5px dashed rgba(79,142,247,0.3);
    border-radius: 12px;
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: rgba(79,142,247,0.03);
    position: relative;
  }
  .up-dropzone:hover, .up-dropzone.active {
    border-color: rgba(79,142,247,0.6);
    background: rgba(79,142,247,0.07);
  }
  .up-dropzone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .up-dropzone-icon {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .up-dropzone-text {
    font-size: 14px;
    font-weight: 500;
    color: #e6edf3;
    margin-bottom: 4px;
  }
  .up-dropzone-sub {
    font-size: 12px;
    color: #8b949e;
  }
  .up-dropzone-file {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(79,142,247,0.12);
    border: 1px solid rgba(79,142,247,0.25);
    color: #4f8ef7;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 6px;
  }

  /* Error */
  .up-error {
    background: rgba(220,38,38,0.1);
    border: 1px solid rgba(220,38,38,0.25);
    color: #f87171;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 13px;
  }

  /* Submit */
  .up-submit {
    width: 100%;
    margin-top: 24px;
    padding: 13px;
    background: linear-gradient(135deg, #4f8ef7 0%, #6366f1 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 16px rgba(79,142,247,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .up-submit:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(79,142,247,0.4);
  }
  .up-submit:active { transform: translateY(0); }
  .up-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 560px) {
    .up-card { padding: 32px 20px 28px; }
    .up-row { grid-template-columns: 1fr; }
    .up-header-title { font-size: 20px; }
  }
`

function UploadPage() {
  const [title, setTitle]           = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject]       = useState("")
  const [type, setType]             = useState("")
  const [file, setFile]             = useState(null)
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)
  const [dragging, setDragging]     = useState(false)

  const navigate = useNavigate()

  const handleUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("subject", subject)
      formData.append("type", type)
      formData.append("file", file)
      await API.post("/resources/upload", formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate("/")
    } catch (err) {
      setError("Upload failed. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="up-root">
        <div className="up-card">

          {/* Header */}
          <div className="up-header">
            <div className="up-header-icon">📤</div>
            <div>
              <div className="up-header-title">Upload Resource</div>
              <div className="up-header-sub">Share your notes, papers & assignments</div>
            </div>
          </div>

          {error && <div className="up-error">⚠ {error}</div>}

          <form onSubmit={handleUpload}>

            {/* Details section */}
            <div className="up-section">Resource details</div>

            <div className="up-field">
              <label className="up-label">Title</label>
              <div className="up-input-wrap">
                <span className="up-input-icon">📝</span>
                <input
                  className="up-input"
                  type="text"
                  placeholder="e.g. Data Structures Notes — Unit 3"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="up-field">
              <label className="up-label">Description</label>
              <div className="up-input-wrap">
                <span className="up-input-icon" style={{top:"18px", transform:"none"}}>💬</span>
                <textarea
                  className="up-textarea"
                  placeholder="Briefly describe what this resource covers..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category section */}
            <div className="up-section">Category</div>

            <div className="up-row">
              <div className="up-field">
                <label className="up-label">Subject</label>
                <div className="up-input-wrap">
                  <span className="up-input-icon">📚</span>
                  <select
                    className="up-select"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                  >
                    <option value="">Select subject</option>
                    <option>Data Structures</option>
                    <option>Operating Systems</option>
                    <option>Algorithms</option>
                    <option>Computer Networks</option>
                    <option>Database Systems</option>
                    <option>Software Engineering</option>
                    <option>Artificial Intelligence</option>
                  </select>
                </div>
              </div>

              <div className="up-field">
                <label className="up-label">Resource type</label>
                <div className="up-input-wrap">
                  <span className="up-input-icon">🗂</span>
                  <select
                    className="up-select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    <option>Notes</option>
                    <option>Assignment</option>
                    <option>Question Paper</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File section */}
            <div className="up-section">File</div>

            <div
              className={`up-dropzone${dragging ? " active" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]) }}
            >
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                required
              />
              <div className="up-dropzone-icon">📁</div>
              <div className="up-dropzone-text">
                {file ? "File selected" : "Drag & drop or click to browse"}
              </div>
              <div className="up-dropzone-sub">PDF, DOC, PPT, images up to 50MB</div>
              {file && (
                <div className="up-dropzone-file">
                  ✓ {file.name}
                </div>
              )}
            </div>

            <button className="up-submit" type="submit" disabled={loading}>
              {loading ? "Uploading…" : "↑ Upload Resource"}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}

export default UploadPage