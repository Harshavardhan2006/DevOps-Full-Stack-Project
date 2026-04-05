import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "../styles/styles.css"

function UploadPage() {
  const [title,       setTitle]       = useState("")
  const [description, setDescription] = useState("")
  const [subject,     setSubject]     = useState("")
  const [type,        setType]        = useState("")
  const [file,        setFile]        = useState(null)
  const [error,       setError]       = useState("")
  const [loading,     setLoading]     = useState(false)
  const [dragging,    setDragging]    = useState(false)

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
    <div className="up-root">
      <div className="up-card">

        <div className="up-header">
          <div className="up-header-icon">📤</div>
          <div>
            <div className="up-header-title">Upload Resource</div>
            <div className="up-header-sub">Share your notes, papers & assignments</div>
          </div>
        </div>

        {error && <div className="up-error">⚠ {error}</div>}

        <form onSubmit={handleUpload}>

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
              <span className="up-input-icon" style={{ top: "18px", transform: "none" }}>💬</span>
              <textarea
                className="up-textarea"
                placeholder="Briefly describe what this resource covers..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="up-section">Category</div>

          <div className="up-row">
            <div className="up-field">
              <label className="up-label">Subject</label>
              <div className="up-input-wrap">
                <span className="up-input-icon">📚</span>
                <select className="up-select" value={subject} onChange={e => setSubject(e.target.value)} required>
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
                <select className="up-select" value={type} onChange={e => setType(e.target.value)} required>
                  <option value="">Select type</option>
                  <option>Notes</option>
                  <option>Assignment</option>
                  <option>Question Paper</option>
                </select>
              </div>
            </div>
          </div>

          <div className="up-section">File</div>

          <div
            className={`up-dropzone${dragging ? " active" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]) }}
          >
            <input type="file" onChange={e => setFile(e.target.files[0])} required />
            <div className="up-dropzone-icon">📁</div>
            <div className="up-dropzone-text">{file ? "File selected" : "Drag & drop or click to browse"}</div>
            <div className="up-dropzone-sub">PDF, DOC, PPT, images up to 50MB</div>
            {file && <div className="up-dropzone-file">✓ {file.name}</div>}
          </div>

          <button className="up-submit" type="submit" disabled={loading}>
            {loading ? "Uploading…" : "↑ Upload Resource"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default UploadPage