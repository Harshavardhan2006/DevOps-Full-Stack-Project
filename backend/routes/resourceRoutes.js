const express     = require("express")
const multer      = require("multer")
const { protect } = require("../middleware/authMiddleware")
const {
  uploadResource,
  getResources,
  searchResources,
  downloadResource,
  popularResources,
  rateResource,
  getMyResources,
  deleteResource
} = require("../controllers/resourceController")

const { storage } = require("../config/cloudinary")
const upload = multer({ storage })

const router = express.Router()

router.get("/",             protect, getResources)
router.get("/search",       protect, searchResources)
router.get("/popular",      protect, popularResources)
router.get("/my",           protect, getMyResources)
router.post("/upload",      protect, upload.single("file"), uploadResource)
router.post("/:id/rate",    protect, rateResource)
router.delete("/:id",       protect, deleteResource)

// Download is public — browser <a href> tags can't send auth headers.
// The Cloudinary URL is already unique and unguessable so this is safe.
router.get("/download/:id", downloadResource)

module.exports = router