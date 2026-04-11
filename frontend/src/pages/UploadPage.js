import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "../styles/styles.css"

const SUBJECTS = [
  "Data Structures",
  "Operating Systems",
  "Algorithms",
  "Computer Networks",
  "Database Systems",
  "Software Engineering",
  "Artificial Intelligence",
]

const TYPES = ["Notes", "Assignment", "Question Paper"]

function CustomSelect({ value, onChange, options, placeholder, icon }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="up-custom-select" ref={ref}>
      <div
        className={`up-custom-select-trigger${open ? " open" : ""}${value ? " selected" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className="up-input-icon">{icon}</span>
        <span className="up-custom-select-value">
          {value || placeholder}
        </span>
        <span className="up-custom-select-arrow">▾</span>
      </div>
      {open && (
        <div className="up-custom-select-dropdown">
          {options.map(opt => (
            <div
              key={opt}
              className={`up-custom-select-option${value === opt ? " active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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

    if (!subject) { setError("Please select a subject."); return }
    if (!type)    { setError("Please select a resource type."); return }
    if (!file)    { setError("Please select a file to upload."); return }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("title",       title)
      formData.append("description", description)
      formData.append("subject",     subject)
      formData.append("type",        type)
      formData.append("file",        file)

      await API.post("/resources/upload", formData)
      navigate("/home")

    } catch (err) {
      console.log(err)
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
              <CustomSelect
                value={subject}
                onChange={setSubject}
                options={SUBJECTS}
                placeholder="Select subject"
                icon="📚"
              />
            </div>

            <div className="up-field">
              <label className="up-label">Resource type</label>
              <CustomSelect
                value={type}
                onChange={setType}
                options={TYPES}
                placeholder="Select type"
                icon="🗂"
              />
            </div>
          </div>

          <div className="up-section">File</div>

          <div
            className={`up-dropzone${dragging ? " active" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setDragging(false)
              if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0])
            }}
          >
            <input
              type="file"
              onChange={e => setFile(e.target.files[0] || null)}
            />
            <div className="up-dropzone-icon">📁</div>
            <div className="up-dropzone-text">
              {file ? "File selected" : "Drag & drop or click to browse"}
            </div>
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