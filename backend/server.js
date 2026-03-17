const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const resourceRoutes = require("./routes/resourceRoutes")

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/resources", resourceRoutes)

app.use("/uploads", express.static("uploads"))

app.get("/", (req,res)=>{
res.send("Backend API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`)
})
