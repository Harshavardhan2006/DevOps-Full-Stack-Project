import { useState } from "react"
import API from "../services/api"

const styles = `
  .sr-wrap { display: flex; flex-direction: column; gap: 10px; }

  .sr-stars { display: flex; gap: 3px; align-items: center; }
  .sr-star {
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.15s ease, filter 0.15s;
    line-height: 1;
    user-select: none;
  }
  .sr-star:hover { transform: scale(1.25); }
  .sr-star.readonly { cursor: default; font-size: 14px; }
  .sr-star.readonly:hover { transform: none; }

  .sr-avg {
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif;
  }
  .sr-avg-val {
    font-size: 15px; font-weight: 600; color: #e6edf3;
  }
  .sr-avg-count { font-size: 12px; color: #8b949e; }

  .sr-form { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
  .sr-label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8b949e; }
  .sr-submit {
    align-self: flex-start;
    padding: 6px 16px;
    background: linear-gradient(135deg, #4f8ef7, #6366f1);
    color: #fff; border: none; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: opacity 0.18s;
    box-shadow: 0 2px 10px rgba(79,142,247,0.25);
  }
  .sr-submit:hover { opacity: 0.88; }
  .sr-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .sr-thanks { font-size: 12px; color: #10b981; font-weight: 600; }
`

// Read-only star display
export function StarDisplay({ avg = 0, count = 0 }) {
  const filled = Math.round(avg)
  return (
    <>
      <style>{styles}</style>
      <div className="sr-avg">
        <div className="sr-stars">
          {[1,2,3,4,5].map(i => (
            <span key={i} className="sr-star readonly">
              {i <= filled ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <span className="sr-avg-val">{avg > 0 ? avg.toFixed(1) : "—"}</span>
        <span className="sr-avg-count">({count})</span>
      </div>
    </>
  )
}

// Interactive rating widget
function StarRating({ resourceId, existingRating = 0, avgRating = 0, ratingCount = 0, onRated }) {
  const [hover, setHover]     = useState(0)
  const [selected, setSelected] = useState(existingRating)
  const [submitted, setSubmitted] = useState(!!existingRating)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await API.post(`/resources/${resourceId}/rate`,
        { stars: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSubmitted(true)
      if (onRated) onRated(selected)
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  const display = hover || selected

  return (
    <>
      <style>{styles}</style>
      <div className="sr-wrap">
        {/* Current avg */}
        <StarDisplay avg={avgRating} count={ratingCount} />

        {/* Rate form */}
        {submitted ? (
          <span className="sr-thanks">✓ You rated {selected} star{selected !== 1 ? "s" : ""}</span>
        ) : (
          <div className="sr-form">
            <span className="sr-label">Rate this resource</span>
            <div className="sr-stars">
              {[1,2,3,4,5].map(i => (
                <span
                  key={i}
                  className="sr-star"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setSelected(i)}
                >
                  {i <= display ? "⭐" : "☆"}
                </span>
              ))}
            </div>
            <button className="sr-submit" onClick={handleSubmit} disabled={!selected || loading}>
              {loading ? "Saving…" : "Submit rating"}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default StarRating