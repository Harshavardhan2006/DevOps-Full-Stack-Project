import { Link } from "react-router-dom"

function Navbar(){

const logout = ()=>{
localStorage.removeItem("token")
window.location.href="/login"
}

return(

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"15px 30px",
background:"#1f2937",
color:"#fff"
}}>

<Link to="/" style={{
display:"flex",
alignItems:"center",
gap:"10px",
textDecoration:"none",
color:"#fff"
}}>

<img
src="/logo.svg"
alt="logo"
style={{
width:"32px",
height:"32px"
}}
/>

<h2 style={{margin:0}}>
Student Resource Platform
</h2>

</Link>

<div style={{display:"flex",gap:"20px",alignItems:"center"}}>

<Link to="/" style={{color:"#fff",textDecoration:"none"}}>
Home
</Link>

<Link to="/upload" style={{color:"#fff",textDecoration:"none"}}>
Upload
</Link>

<Link to="/my-uploads" style={{color:"#fff",textDecoration:"none"}}>
My Uploads
</Link>

<button
onClick={logout}
style={{
background:"#2563eb",
border:"none",
color:"#fff",
padding:"6px 12px",
borderRadius:"6px",
cursor:"pointer"
}}

>

Logout </button>

</div>

</div>

)

}

export default Navbar
