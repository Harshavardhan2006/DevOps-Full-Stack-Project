const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const path = require("path")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "")
    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"]
    const resourceType = imageTypes.includes(ext) ? "image" : "raw"

    return {
      folder:        "student-resources",
      resource_type: resourceType,
      public_id:     `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`
    }
  }
})

module.exports = { cloudinary, storage }