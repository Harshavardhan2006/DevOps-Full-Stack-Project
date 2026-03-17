function PdfPreviewModal({resource,onClose}){

if(!resource) return null

return(

<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.6)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"#fff",
width:"80%",
height:"80%",
padding:"10px"
}}>

<button onClick={onClose}>Close</button>

<iframe
title="preview"
src={`http://localhost:5000/uploads/${resource.fileUrl}`}
style={{width:"100%",height:"90%"}}
/>

</div>

</div>

)

}

export default PdfPreviewModal
