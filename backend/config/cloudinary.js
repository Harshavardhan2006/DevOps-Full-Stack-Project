const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        "student-resources",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx", "ppt", "pptx", "png", "jpg", "jpeg", "zip", "txt"],
    public_id: (req, file) => {
      const name = file.originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-")
      return `${Date.now()}-${name}`
    }
  }
})

module.exports = { cloudinary, storage }