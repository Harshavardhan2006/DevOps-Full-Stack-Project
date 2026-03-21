const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Protect — verifies JWT and attaches user to req
const protect = async (req, res, next) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }

  const token = authHeader.split(" ")[1]

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch full user so req.user has name, email, role etc.
    req.user = await User.findById(decoded.id).select("-password")

    next()

  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }

}

// Admin only — use after protect
const adminOnly = (req, res, next) => {

  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Admin access only" })
  }

}

module.exports = { protect, adminOnly }