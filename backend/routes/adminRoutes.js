const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Resource = require("../models/Resource")
const { protect, adminOnly } = require("../middleware/authMiddleware")

// All admin routes are protected + admin only
router.use(protect, adminOnly)

// GET /api/admin/users — all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// GET /api/admin/resources — all resources with uploader info
router.get("/resources", async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
    res.json(resources)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// DELETE /api/admin/users/:id — remove a user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin" })
    await user.deleteOne()
    res.json({ message: "User removed" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router