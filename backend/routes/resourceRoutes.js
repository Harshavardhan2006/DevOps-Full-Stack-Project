const express = require("express")
const router = express.Router()

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

const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

router.get("/",                                    getResources)
router.get("/search",                              searchResources)
router.get("/popular",                             popularResources)
router.get("/my",          protect,                getMyResources)
router.get("/download/:id",                        downloadResource)
router.post("/upload",     protect, upload.single("file"), uploadResource)
router.post("/:id/rate",   protect,                rateResource)
router.delete("/:id",      protect,                deleteResource)

module.exports = router