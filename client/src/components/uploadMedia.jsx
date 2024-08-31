import { useState } from "react"; 
import axios from "axios"; 
import { useSelector } from "react-redux";  
import toast from 'react-hot-toast';

const UploadMedia =()=> { 
    const user = useSelector((state)=>state.user.value.user) ; 
    const socket = useSelector((state)=>state.user.value.socket) ; 
    const token = useSelector(state=>state.user.value.token);

    const [form,setForm] = useState({userID:`${user._id}`,profile:`${user.photo}`,username:`${user.username}`,photo:'',caption:''});
    const [image,setImage] = useState({}) ;
    const [url,setUrl] =useState('') ; 
    const [mediaType,setMediaType] = useState(0); 
    const [error,setError] = useState('');

    function handle(e){
    setForm({...form,[e.target.name]: e.target.files[0]});  
    
    if(e.target.files.length === 1){ 
      setImage(e.target.files[0]);
      setMediaType(e.target.files[0].type.indexOf('video')) 
      setUrl(URL.createObjectURL(e.target.files[0]))
    }    
  }  

  function handleText(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  function submit(e){
    e.preventDefault(); 
    const formData = new FormData(); 
    formData.append('photo',form.photo); 
    formData.append('userID',form.userID); 
    formData.append('userProfile',form.profile);
    formData.append('userUsername',form.username);
    formData.append('caption',form.caption); 
    axios.post(`/post/`, formData)
      .then(res=>{
        console.log('check',res)
        if(res.data.err){ 
        console.log('err',res.data.err)
        }else{
          toast.success('Successfully posted picture',{style:{
            backgroundColor:'rgb(58,59,60)',
            color:'#fff',             
          }}) ;
          setUrl('');
        }})
      .catch(err=>console.log(err)); 
    
  } 
    return(
        <div className="uploadMedia" style={{width:'70%',display:'flex',justifyContent:'center'}}>  
            <div style={{margin:'20px 0px 0px 0px', width:'80%'}}>
            <div style={{border:'1px dashed grey',borderRadius:'10px',margin:'auto',textAlign:'center',width:'100%',height:'300px',padding:'20px 0px',display:'flex',justifyContent:'center',alignItems:'center'}}>
              {form.photo?<div>{mediaType !== 0?<img src={url} alt='selected image' style={{width: '300px', height:'300px',objectFit:'cover'}}></img>:<video controls autoPlay loop style={{width: '300px', height:'300px'}}><source src={url} type="video/mp4"/> Video is not displaying</video>}</div>:<p>Display media</p>}
            </div>
            <form action='upload/' method='POST' onSubmit={submit} encType='multipart/form-data' style={{marginTop:'10px'}}> 
              <div style={{width:'inherit'}}>
                <input type='file' name='photo' onChange={handle} style={{width:'90%'}}></input> 
              </div> 
              <div style={{margin:'15px 0px'}} >
                <input  type="text" name="caption" onChange={handleText}  placeholder="Add a caption" className="input" style={{width:'95%',height:'30px',borderRadius:'15px',paddingLeft:'20px',marginTop:'10px',fontSize:'14px'}}/>
              </div> 
              
              
             
            {error && <p style={{color:'red'}}> Error : {error}</p>}
            <div style={{display:'grid',placeItems:'center'}}>
              <button className="submitButton" style={{backgroundColor:'transparent',width:'fit-content',height:'fit-content',padding:'10px 15px',borderRadius:'20px',fontSize:'14px',margin:'auto',color:' rgb(176,179,184)'}}type='submit'>Submit</button>

            </div>
          </form>  
          </div>

        </div>
    )
}
export default UploadMedia;