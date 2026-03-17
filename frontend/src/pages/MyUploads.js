import { useEffect, useState } from "react"
import API from "../services/api"

function MyUploads(){

const [resources,setResources] = useState([])

useEffect(()=>{
fetchUploads()
},[])

const fetchUploads = async()=>{

try{

const token = localStorage.getItem("token")

const res = await API.get("/resources/my",{
headers:{Authorization:`Bearer ${token}`}
})

setResources(res.data)

}catch(err){
console.log(err)
}

}

const deleteResource = async(id)=>{

try{

const token = localStorage.getItem("token")

await API.delete(`/resources/${id}`,{
headers:{
Authorization:`Bearer ${token}`
}
})

setResources(resources.filter(r => r._id !== id))

}catch(err){
console.log(err)
alert("Delete failed")
}

}

return(

<div style={{
padding:"40px",
minHeight:"100vh",
background:"#c0c0c0ba"
}}>

<h1 style={{marginBottom:"30px"}}>
My Uploaded Resources
</h1>

{resources.length === 0 && (

<p>You haven't uploaded any resources yet.</p>
)}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
gap:"25px"
}}>

{resources.map(resource => (

<div
key={resource._id}
style={{
background:"#ffffff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 6px 20px rgba(0,0,0,0.1)"
}}
>

<h3>{resource.title}</h3>

<p>
<b>Subject:</b> {resource.subject}
</p>

<p style={{fontSize:"14px"}}>
{resource.description}
</p>

<p>
<b>Downloads:</b> {resource.downloads}
</p>

<div style={{
marginTop:"15px",
display:"flex",
gap:"10px"
}}>

<a
href={`http://localhost:5000/uploads/${resource.fileUrl}`}
target="_blank"
rel="noreferrer"
style={{
background:"#2563eb",
color:"#fff",
padding:"6px 10px",
borderRadius:"5px",
textDecoration:"none"
}}

>

View </a>

<a
href={`http://localhost:5000/api/resources/download/${resource._id}`}
style={{
background:"#16a34a",
color:"#fff",
padding:"6px 10px",
borderRadius:"5px",
textDecoration:"none"
}}

>

Download </a>

<button
onClick={()=>deleteResource(resource._id)}
style={{
background:"#ef4444",
color:"#fff",
border:"none",
padding:"6px 10px",
borderRadius:"5px",
cursor:"pointer"
}}

>

Delete </button>

</div>

</div>

))}

</div>

</div>

)

}

export default MyUploads
