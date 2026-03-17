import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import bg from "../assets/bg.jpg"

function LoginPage({setToken}){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

const navigate = useNavigate()

const handleSubmit = async (e)=>{

e.preventDefault()

setError("")

try{

const res = await API.post("/auth/login",{
email,
password
})

localStorage.setItem("token",res.data.token)
setToken(res.data.token)

navigate("/home")

}catch(err){

setError("Invalid email or password")

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
marginBottom:"20px"
}}>
Student Resource Platform
</h2>

<form onSubmit={handleSubmit}>

{error && (

<div style={{
background:"#ffe6e6",
color:"#cc0000",
padding:"10px",
borderRadius:"6px",
marginBottom:"15px",
textAlign:"center",
fontSize:"14px"
}}>
{error}
</div>
)}

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

Login </button>

</form>

<p style={{
marginTop:"20px",
textAlign:"center",
fontSize:"14px"
}}>
Not registered? <Link to="/register">Register here</Link>
</p>

</div>

</div>

)

}

export default LoginPage