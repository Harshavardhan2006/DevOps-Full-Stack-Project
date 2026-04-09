const Resource = require("../models/Resource")
const cloudinary = require("../config/cloudinary")

exports.uploadResource = async (req, res) => {

  try {

    const { title, description, subject, type } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "File is required" })
    }

    const resource = await Resource.create({
      title,
      description,
      subject,
      type,
      fileUrl:    req.file.path,
      publicId:   req.file.filename,
      uploadedBy: req.user.id
    })

    res.json(resource)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.getResources = async (req, res) => {

  try {

    const resources = await Resource.find()
      .populate("uploadedBy", "name email")

    res.json(resources)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.searchResources = async (req, res) => {

  try {

    const { title, subject } = req.query
    let query = {}

    if (title)   query.title   = { $regex: title,   $options: "i" }
    if (subject) query.subject = { $regex: subject, $options: "i" }

    const resources = await Resource.find(query)
    res.json(resources)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.downloadResource = async (req, res) => {

  try {

    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

    resource.downloads += 1
    await resource.save()

    // Redirect to Cloudinary URL — browser handles the download
    res.redirect(resource.fileUrl)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.popularResources = async (req, res) => {

  try {

    const resources = await Resource.find()
      .sort({ downloads: -1 })
      .limit(5)

    res.json(resources)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.rateResource = async (req, res) => {

  try {

    const { stars } = req.body

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" })
    }

    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

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

    res.json({
      avgRating:   resource.avgRating,
      ratingCount: resource.ratingCount
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.getMyResources = async (req, res) => {

  try {

    const resources = await Resource.find({ uploadedBy: req.user.id })
    res.json(resources)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}

exports.deleteResource = async (req, res) => {

  try {

    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

    const isAdmin = req.user.role === "admin"
    const isOwner = resource.uploadedBy.toString() === req.user.id.toString()

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Delete file from Cloudinary when resource is deleted
    if (resource.publicId) {
      await cloudinary.uploader.destroy(resource.publicId, {
        resource_type: "raw"
      })
    }

    await resource.deleteOne()

    res.json({ message: "Resource deleted" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" })
  }

}