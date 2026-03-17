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

const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

router.post("/upload",authMiddleware,upload.single("file"),uploadResource)

router.get("/",getResources)

router.get("/search",searchResources)

router.get("/download/:id",downloadResource)

router.get("/popular",popularResources)

router.post("/rate/:id",rateResource)

router.get("/my",authMiddleware,getMyResources)

router.delete("/:id",authMiddleware,deleteResource)

module.exports = router