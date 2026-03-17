const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema({

title:String,
description:String,
subject:String,
type:String,

fileUrl:String,

uploadedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

downloads:{
type:Number,
default:0
},

rating:{
type:Number,
default:0
},

numReviews:{
type:Number,
default:0
}

},{timestamps:true})

module.exports = mongoose.model("Resource",resourceSchema)