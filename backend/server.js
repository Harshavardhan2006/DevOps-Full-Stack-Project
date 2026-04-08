const express = require("express")
const cors = require("cors")
const { GridFSBucket, ObjectId } = require("mongodb")
const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const resourceRoutes = require("./routes/resourceRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

// ── CORS ────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,          // set this in Render env vars
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

app.use(express.json())

connectDB()

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth",      authRoutes)
app.use("/api/resources", resourceRoutes)
app.use("/api/admin",     adminRoutes)

// ── GridFS file serve (replaces express.static("uploads")) ───
// Files are now streamed directly from MongoDB GridFS
app.get("/uploads/:filename", async (req, res) => {
  try {
    const db     = mongoose.connection.db
    const bucket = new GridFSBucket(db, { bucketName: "uploads" })

    // Find the file first so we can set the right Content-Type
    const files = await db
      .collection("uploads.files")
      .find({ filename: req.params.filename })
      .toArray()

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" })
    }

    const file = files[0]
    res.set("Content-Type", file.contentType || "application/octet-stream")
    res.set("Content-Disposition", `inline; filename="${file.filename}"`)

    const downloadStream = bucket.openDownloadStreamByName(req.params.filename)
    downloadStream.pipe(res)

    downloadStream.on("error", () => {
      res.status(404).json({ message: "File not found" })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/", (req, res) => {
  res.send("Backend API Running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))