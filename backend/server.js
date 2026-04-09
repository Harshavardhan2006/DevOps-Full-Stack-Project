const express  = require("express")
const cors     = require("cors")
require("dotenv").config()

const connectDB      = require("./config/db")
const authRoutes     = require("./routes/authRoutes")
const resourceRoutes = require("./routes/resourceRoutes")
const adminRoutes    = require("./routes/adminRoutes")

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true
}))

app.use(express.json())

connectDB()

app.use("/api/auth",      authRoutes)
app.use("/api/resources", resourceRoutes)
app.use("/api/admin",     adminRoutes)

app.get("/", (req, res) => {
  res.send("Backend API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})