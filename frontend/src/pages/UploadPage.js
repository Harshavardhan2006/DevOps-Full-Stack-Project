import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function UploadPage(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [subject,setSubject] = useState("")
const [type,setType] = useState("")
const [file,setFile] = useState(null)
const [error,setError] = useState("")
const navigate = useNavigate()

const handleUpload = async (e)=>{

e.preventDefault()

try{

const token = localStorage.getItem("token")

const formData = new FormData()
formData.append("title",title)
formData.append("description",description)
formData.append("subject",subject)
formData.append("type",type)
formData.append("file",file)

await API.post("/resources/upload",formData,{
headers:{
Authorization:`Bearer ${token}`
}
})

setTitle("")
setDescription("")
setSubject("")
setType("")
setFile(null)
setError("")

navigate("/")

}catch(err){
setError("Upload failed. Please try again.")
}

}

return(

<div style={{
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#c0c0c0ba"
}}>

<div style={{
width:"420px",
background:"#ffffff",
padding:"40px",
borderRadius:"12px",
boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
}}>

<h2 style={{
marginBottom:"25px",
textAlign:"center"
}}>
Upload Resource
</h2>

{error && (
<p style={{
color:"red",
marginBottom:"15px",
textAlign:"center"
}}>
{error}
</p>
)}

<form onSubmit={handleUpload}>

<input
type="text"
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
borderRadius:"6px",
border:"1px solid #ccc"
}}
/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
borderRadius:"6px",
border:"1px solid #ccc"
}}
/>

<select
value={subject}
onChange={(e)=>setSubject(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
borderRadius:"6px",
border:"1px solid #ccc"
}}
>

<option value="">Select Subject</option>
<option>Data Structures</option>
<option>Operating Systems</option>
<option>Algorithms</option>
<option>Computer Networks</option>
<option>Database Systems</option>
<option>Software Engineering</option>
<option>Artificial Intelligence</option>


</select>

<select
value={type}
onChange={(e)=>setType(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
borderRadius:"6px",
border:"1px solid #ccc"
}}
>

<option value="">Select Resource Type</option>
<option>Notes</option>
<option>Assignment</option>
<option>Question Paper</option>

</select>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
required
style={{
marginBottom:"20px"
}}
/>

<button
type="submit"
style={{
width:"100%",
padding:"12px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"6px",
fontWeight:"bold",
cursor:"pointer"
}}
>
Upload Resource
</button>

</form>

</div>

</div>

)

}

export default UploadPage