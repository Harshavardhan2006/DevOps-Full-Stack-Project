// backend/config/gridfs.js
// Multer storage that pipes uploaded files directly into MongoDB GridFS.
// No local "uploads/" folder is needed — files live in the database.

const multer  = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      // Store under the "uploads" bucket (creates uploads.files + uploads.chunks)
      bucketName: "uploads",
      // Keep a unique filename: timestamp + original name
      filename:   `${Date.now()}-${file.originalname}`,
    }
  },
})

// Accept any file type; restrict by size (20 MB max)
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
})

module.exports = upload