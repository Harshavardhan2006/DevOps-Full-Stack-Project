import { useEffect, useState } from "react"
import API from "../services/api"

function HomePage(){

const [resources,setResources] = useState([])
const [search,setSearch] = useState("")
const [filter,setFilter] = useState("All")

useEffect(()=>{
fetchResources()
},[])

const fetchResources = async ()=>{
try{
const res = await API.get("/resources")
setResources(res.data)
}catch(err){
console.log(err)
}
}

const subjects = ["All","Data Structures","Operating Systems","Algorithms","Computer Networks","Database Systems","Software Engineering","Artificial Intelligence"]

const filteredResources = resources.filter(r => {

const matchesSearch =
r.title.toLowerCase().includes(search.toLowerCase()) ||
r.description.toLowerCase().includes(search.toLowerCase())

const matchesSubject =
filter === "All" || r.subject === filter

return matchesSearch && matchesSubject

})

return(

<div style={{
minHeight:"100vh",
background:"#c0c0c0ba",
padding:"30px"
}}>

<h1 style={{marginBottom:"20px", fontSize:"30px"}}>
Knowledge grows when shared, and shines brightest when accessible to all.
</h1>

<input
type="text"
placeholder="Search resources..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"10px",
width:"300px",
borderRadius:"6px",
border:"1px solid #ccc",
marginBottom:"15px"
}}
/>

<div style={{marginBottom:"25px"}}>

{subjects.map(sub=>(
<button
key={sub}
onClick={()=>setFilter(sub)}
style={{
marginRight:"10px",
padding:"8px 14px",
borderRadius:"6px",
border:"none",
background: filter === sub ? "#2563eb" : "#eee",
color: filter === sub ? "#fff" : "#000",
cursor:"pointer"
}}

>

{sub} </button>
))}

</div>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"25px"
}}
>

{filteredResources.map(resource => (

<div
key={resource._id}
style={{
background:"#ffffff",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
transition:"0.3s"
}}
>

<h3 style={{marginBottom:"10px"}}>
{resource.title}
</h3>

<p>
<strong>Subject:</strong> {resource.subject}
</p>

<p style={{fontSize:"14px",color:"#555"}}>
{resource.description}
</p>

<p>
<strong>Downloads:</strong> {resource.downloads}
</p>

<p style={{fontSize:"13px",color:"#666"}}>
Uploaded by: {resource.uploadedBy?.name}
</p>

<div style={{marginTop:"15px"}}>

<a
href={`http://localhost:5000/uploads/${resource.fileUrl}`}
target="_blank"
rel="noreferrer"
style={{
marginRight:"8px",
padding:"6px 10px",
background:"#2563eb",
color:"#fff",
borderRadius:"5px",
textDecoration:"none"
}}

>

View </a>

<a
href={`http://localhost:5000/api/resources/download/${resource._id}`}
style={{
marginRight:"8px",
padding:"6px 10px",
background:"#16a34a",
color:"#fff",
borderRadius:"5px",
textDecoration:"none"
}}

>

Download </a>

</div>

</div>

))}

</div>

</div>

)

}

export default HomePage
