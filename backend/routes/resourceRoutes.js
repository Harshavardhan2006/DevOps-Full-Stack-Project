// backend/routes/resourceRoutes.js
const express  = require("express")
const router   = express.Router()
const upload   = require("../config/gridfs")          // ← GridFS multer
const auth     = require("../middleware/authMiddleware")
const {
  uploadResource,
  getResources,
  searchResources,
  downloadResource,
  popularResources,
  rateResource,
  getMyResources,
  deleteResource,
} = require("../controllers/resourceController")

router.post(  "/",                    auth, upload.single("file"), uploadResource)
router.get(   "/",                    getResources)
router.get(   "/search",              searchResources)
router.get(   "/popular",             popularResources)
router.get(   "/my",                  auth, getMyResources)
router.get(   "/download/:id",        auth, downloadResource)
router.post(  "/rate/:id",            auth, rateResource)
router.delete("/:id",                 auth, deleteResource)

module.exports = router