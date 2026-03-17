import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"

function RegisterPage(){

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const navigate = useNavigate()

const handleSubmit = async (e)=>{

e.preventDefault()

try{

await API.post("/auth/register",{
name,
email,
password
})

alert("Registration successful")

navigate("/login")

}catch(error){
alert("Registration failed")
}

}

return(

<div style={{
minHeight:"100vh",
width:"100%",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:`linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url(${bg})`,
backgroundSize:"cover",
backgroundPosition:"center",
backgroundRepeat:"no-repeat"
}}>

<div style={{
width:"90%",
maxWidth:"400px",
padding:"40px",
background:"#ffffff",
borderRadius:"12px",
boxShadow:"0 10px 25px rgba(0,0,0,0.15)"
}}>

<h2 style={{
textAlign:"center",
marginBottom:"25px"
}}>
Create Account
</h2>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
border:"1px solid #ccc",
borderRadius:"5px"
}}
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
border:"1px solid #ccc",
borderRadius:"5px"
}}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"20px",
border:"1px solid #ccc",
borderRadius:"5px"
}}
/>

<button
type="submit"
style={{
width:"100%",
padding:"10px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"5px",
cursor:"pointer",
fontWeight:"bold"
}}

>

Register </button>

</form>

<p style={{
marginTop:"20px",
textAlign:"center",
fontSize:"14px"
}}>
Already have an account? <Link to="/login">Login here</Link>
</p>

</div>

</div>

)

}

export default RegisterPage
