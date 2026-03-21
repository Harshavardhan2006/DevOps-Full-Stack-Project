const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema({

  title:       String,
  description: String,
  subject:     String,
  type:        String,

  fileUrl: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  downloads: {
    type: Number,
    default: 0
  },

  // Replaced old rating + numReviews with a proper ratings array
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