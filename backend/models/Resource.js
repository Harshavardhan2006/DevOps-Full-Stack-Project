const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  subject: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["Notes", "Assignment", "Question Paper"],
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  publicId: {
    type: String,
    default: ""
  },

  // Original filename for proper download naming
  originalFilename: {
    type: String,
    default: ""
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  downloads: {
    type: Number,
    default: 0
  },

  ratings: [
    {
      user:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      stars: { type: Number, min: 1, max: 5 }
    }
  ],

  avgRating: {
    type: Number,
    default: 0
  },

  ratingCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true })

module.exports = mongoose.model("Resource", resourceSchema)