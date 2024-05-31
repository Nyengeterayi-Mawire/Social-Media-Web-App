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
    // const [image,setImage] = useState(null); 
     
    // console.log('id',user);

    function handle(e){
    setForm({...form,[e.target.name]: e.target.files[0]});  
    
    // console.log(form.photo); 
    // console.log(e.target.files);  
    
    // console.log('index of video',e.target.files[0].type.indexOf('video'))
    // console.log('file lebgth',e.target.files.length) 
    if(e.target.files.length === 1){ 
      setImage(e.target.files[0]);
      setMediaType(e.target.files[0].type.indexOf('video')) 
      // console.log('value',e.target.files)
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
  //   console.log(formData);  
  // console.log('form',form);
    console.log('token',token)
    axios.post(`/post/`, formData)
      .then(res=>{
        console.log('check',res)
        if(res.data.err){ 
        console.log('err',res.data.err)
        setError(res.data.err)
        }else{
          toast('Successfully posted picture') ;
          setUrl('');
          socket.emit('addPost',form)
        }})
      .catch(err=>console.log(err)); 
    socket.emit('addPost',form)
  } 
  // console.log('keys in object',Object.keys(image))
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
              <button className="submitButton" style={{backgroundColor:'transparent',width:'80px',height:'30px',borderRadius:'20px',fontSize:'14px',margin:'auto',color:' rgb(176,179,184)'}}type='submit'>Submit</button>

            </div>
          </form>  
          </div>

      {/* <Register/> */} 
      {/* <Login/> */}

      {/* {image && <img src={`http://localhost:3001/${image.media[0].filename}`} alt=''></img>} */}
      {/* {image && image.media.map((set)=>{
        
        return <img src={`http://localhost:3001/${set.filename}`} alt='image' style={{width:'25%',height:'25%'}}></img>
      })} */}
        </div>
    )
}
export default UploadMedia;