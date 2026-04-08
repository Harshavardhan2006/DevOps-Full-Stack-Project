const mongoose = require("mongoose")
const { GridFSBucket } = require("mongodb")
const Resource = require("../models/Resource")

// ── Upload ────────────────────────────────────────────────────
exports.uploadResource = async (req, res) => {
  try {
    const { title, description, subject, type } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "File is required" })
    }

    // req.file.filename is set by multer-gridfs-storage
    const resource = await Resource.create({
      title,
      description,
      subject,
      type,
      fileUrl:    req.file.filename,
      uploadedBy: req.user.id,
    })

    console.log("Resource saved:", resource)
    res.json(resource)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── Get all ───────────────────────────────────────────────────
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("uploadedBy", "name email")
    res.json(resources)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── Search ────────────────────────────────────────────────────
exports.searchResources = async (req, res) => {
  try {
    const { title, subject } = req.query
    const query = {}
    if (title)   query.title   = { $regex: title,   $options: "i" }
    if (subject) query.subject = { $regex: subject, $options: "i" }
    const resources = await Resource.find(query)
    res.json(resources)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── Download (streams from GridFS, increments counter) ────────
exports.downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ message: "Resource not found" })

    resource.downloads += 1
    await resource.save()

    const db     = mongoose.connection.db
    const bucket = new GridFSBucket(db, { bucketName: "uploads" })

    // Find file metadata to get the original name for Content-Disposition
    const files = await db
      .collection("uploads.files")
      .find({ filename: resource.fileUrl })
      .toArray()

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found in storage" })
    }

    const file = files[0]
    res.set("Content-Type", file.contentType || "application/octet-stream")
    res.set("Content-Disposition", `attachment; filename="${resource.title}"`)

    const downloadStream = bucket.openDownloadStreamByName(resource.fileUrl)
    downloadStream.pipe(res)

    downloadStream.on("error", () => {
      res.status(404).json({ message: "File stream error" })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── Popular ───────────────────────────────────────────────────
exports.popularResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ downloads: -1 }).limit(5)
    res.json(resources)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── Rate ──────────────────────────────────────────────────────
exports.rateResource = async (req, res) => {
  try {
    const { stars } = req.body
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" })
    }

    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ message: "Resource not found" })

    if (!resource.ratings) resource.ratings = []

    const existingIndex = resource.ratings.findIndex(
      r => r.user.toString() === req.user.id.toString()
    )

    if (existingIndex >= 0) {
      resource.ratings[existingIndex].stars = stars
    } else {
      resource.ratings.push({ user: req.user.id, stars })
    }

    const total = resource.ratings.reduce((sum, r) => sum + r.stars, 0)
    resource.avgRating   = parseFloat((total / resource.ratings.length).toFixed(1))
    resource.ratingCount = resource.ratings.length

    await resource.save()
    res.json({ avgRating: resource.avgRating, ratingCount: resource.ratingCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── My resources ──────────────────────────────────────────────
exports.getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user.id })
    res.json(resources)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ── Delete (also removes file from GridFS) ───────────────────
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ message: "Resource not found" })

    const isAdmin = req.user.role === "admin"
    const isOwner = resource.uploadedBy.toString() === req.user.id.toString()
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Delete the physical file from GridFS too
    try {
      const db     = mongoose.connection.db
      const bucket = new GridFSBucket(db, { bucketName: "uploads" })
      const files  = await db
        .collection("uploads.files")
        .find({ filename: resource.fileUrl })
        .toArray()

      if (files.length > 0) {
        await bucket.delete(files[0]._id)
      }
    } catch (fsErr) {
      // Don't block deletion of the DB record if file is already gone
      console.warn("GridFS delete warning:", fsErr.message)
    }

    await resource.deleteOne()
    res.json({ message: "Resource deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}