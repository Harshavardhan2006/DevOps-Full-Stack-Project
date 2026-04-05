import { useState } from "react"
import API from "../services/api"
import "../styles/styles.css"

export function StarDisplay({ avg = 0, count = 0 }) {
  const filled = Math.round(avg)
  return (
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
  )
}

function StarRating({ resourceId, existingRating = 0, avgRating = 0, ratingCount = 0, onRated }) {
  const [hover,     setHover]     = useState(0)
  const [selected,  setSelected]  = useState(existingRating)
  const [submitted, setSubmitted] = useState(!!existingRating)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")

  const handleSubmit = async () => {
    if (!selected) return
    setLoading(true)
    setError("")
    try {
      const res = await API.post(`/resources/${resourceId}/rate`, { stars: selected })
      setSubmitted(true)
      // FIX: pass updated avg and count back to parent so card updates without refetch
      if (onRated) onRated(res.data.avgRating, res.data.ratingCount)
    } catch (err) {
      console.log(err)
      setError("Failed to submit rating. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const display = hover || selected

  return (
    <div className="sr-wrap">
      <StarDisplay avg={avgRating} count={ratingCount} />
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
          {error && (
            <span style={{ fontSize: "12px", color: "#f87171" }}>{error}</span>
          )}
          <button
            className="sr-submit"
            onClick={handleSubmit}
            disabled={!selected || loading}
          >
            {loading ? "Saving…" : "Submit rating"}
          </button>
        </div>
      )}
    </div>
  )
}

export default StarRating