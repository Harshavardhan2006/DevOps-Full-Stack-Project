const Resource = require("../models/Resource")

exports.uploadResource = async (req,res)=>{

try{

const {title,description,subject,type} = req.body

if(!req.file){
return res.status(400).json({message:"File is required"})
}

const resource = await Resource.create({
title,
description,
subject,
type,
fileUrl:req.file.filename,
uploadedBy:req.user.id
})

console.log("Resource saved:",resource)

res.json(resource)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.getResources = async (req,res)=>{

try{

const resources = await Resource.find()
.populate("uploadedBy","name email")

res.json(resources)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.searchResources = async (req,res)=>{

try{

const {title,subject} = req.query

let query = {}

if(title){
query.title = {$regex:title,$options:"i"}
}

if(subject){
query.subject = {$regex:subject,$options:"i"}
}

const resources = await Resource.find(query)

res.json(resources)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.downloadResource = async (req,res)=>{

try{

const resource = await Resource.findById(req.params.id)

if(!resource){
return res.status(404).json({message:"Resource not found"})
}

resource.downloads += 1
await resource.save()

res.download(`uploads/${resource.fileUrl}`)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.popularResources = async (req,res)=>{

try{

const resources = await Resource.find()
.sort({downloads:-1})
.limit(5)

res.json(resources)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.rateResource = async (req,res)=>{

try{

const {rating} = req.body

const resource = await Resource.findById(req.params.id)

if(!resource){
return res.status(404).json({message:"Resource not found"})
}

if(!resource.numReviews){
resource.numReviews = 0
}

resource.rating =
((resource.rating * resource.numReviews) + rating) /
(resource.numReviews + 1)

resource.numReviews += 1

await resource.save()

res.json(resource)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.getMyResources = async (req,res)=>{

try{

const resources = await Resource.find({
uploadedBy:req.user.id
})

res.json(resources)

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}

exports.deleteResource = async (req,res)=>{

try{

const resource = await Resource.findById(req.params.id)

if(!resource){
return res.status(404).json({message:"Resource not found"})
}

if(resource.uploadedBy.toString() !== req.user.id){
return res.status(403).json({message:"Not authorized"})
}

await resource.deleteOne()

res.json({message:"Resource deleted"})

}catch(error){

console.log(error)
res.status(500).json({message:"Server error"})

}

}
