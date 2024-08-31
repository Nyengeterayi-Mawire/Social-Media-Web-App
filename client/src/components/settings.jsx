import { useState } from "react"; 
import axios from "axios"; 
import { useSelector,useDispatch } from "react-redux";  
import { changeSettings } from "../features/userSlice";
import toast from "react-hot-toast";

const SettingsComponent =({user})=> { 
    const token = useSelector(state=>state.user.value.token)

    const [form,setForm] = useState({photo:'',username:'',password:'',confirmpassword:'',firstname:'',lastname:'',email:''})  
    const [image,setImage] = useState('');  
    const [error,setError] = useState('');
    const dispatch = useDispatch();

    const id = useSelector((state)=>state.user.value._id) ;  

    function handlePhoto(e){
    setForm({...form,[e.target.name]: e.target.files[0]}); 
    setImage(URL.createObjectURL(e.target.files[0]));
  }  

    function handleTextInput(e){
      setForm({...form, [e.target.name]:e.target.value});
      
    }


  function submit(e){
    e.preventDefault();  
    const formData = new FormData();  
    if(form.photo !== ''){
      formData.append('photo',form.photo); 
    }
    if(form.username !== ''){
      formData.append('username',form.username); 
    }
    
    if(form.password !== '' && form.password === form.confirmpassword){
      formData.append('password',form.password) 
    }
    if(form.firstname !== '' && form.firstname !== user.firstname){ 
      
      formData.append('firstname',form.firstname)
    }
    if(form.lastname !== '' && form.lastname !== user.lastname){
      formData.append('lastname',form.lastname)
    } 
    if(form.email !== '' && form.email !== user.email){
      formData.append('email',form.email)
    }
    
    axios.patch(`/register/settings/${user._id}`, formData)
      .then(res=>{if(res.data.err){
        setError(res.data.err)
        }else{
          dispatch(changeSettings(form)) 
          setError('')
          setImage('')
          toast.success('successfully updated profile',{ 
            style:{
              backgroundColor:'rgb(58,59,60)',
              color:'#fff', 
            }            
          })
        }})
      .catch(err=>console.log(err));  
  }
    return(
        <div className="settingsComp" style={{width:'73%'}}>
            <form action='upload/' method='PATCH' onSubmit={submit} encType='multipart/form-data'> 
            <div className="settingsProfilePicture" id="settingsDivs"> 
              <h2>Profile Picture</h2>  
          
              <img src={image} alt='prof pic'></img>
              <input  className="input" type='file' name='photo' onChange={handlePhoto}></input> 
              
            </div> 
            <div className="settingsUserInfo" id="settingsDivs"> 
               <h2>User Info</h2>
              <div className="textInputSettingsForm"> 
                <label style={{paddingLeft:'10px'}}>Username</label>
                <input className="input" style={{width:'150px',height:'25px',borderRadius:'15px',paddingLeft:'10px',marginTop:'10px'}} name='username' placeholder="username..." onChange={handleTextInput} />
              </div>
              <div className="textInputSettingsForm"> 
                <label style={{paddingLeft:'10px'}}>Password</label>
                <input className="input" style={{width:'150px',height:'25px',borderRadius:'15px',paddingLeft:'10px',marginTop:'10px'}} name='password' placeholder="password..." onChange={handleTextInput} />
              </div>
              <div className="textInputSettingsForm"> 
                <label style={{paddingLeft:'10px'}}>Confirm password</label>
                <input className="input" style={{width:'150px',height:'25px',borderRadius:'15px',paddingLeft:'10px',marginTop:'10px'}} name='confirmpassword' placeholder="confirm password..." onChange={handleTextInput} />
              </div>

            </div > 
            <div className="settingsPersonalInfo" id="settingsDivs">
              <h2>Personal Info</h2> 
              <div className="textInputSettingsForm"> 
                <label style={{paddingLeft:'10px'}}>Name</label>
                <input className="input" style={{width:'150px',height:'25px',borderRadius:'15px',paddingLeft:'10px',marginTop:'10px'}} name='firstname'  placeholder="name..." onChange={handleTextInput} />
              </div>
              <div className="textInputSettingsForm"> 
                <label style={{paddingLeft:'10px'}}>Surname</label>
                <input className="input" style={{width:'150px',height:'25px',borderRadius:'15px',paddingLeft:'10px',marginTop:'10px'}} name='lastname'  placeholder="surname..." onChange={handleTextInput} />
              </div>
              <div className="textInputSettingsForm"> 
                <label style={{paddingLeft:'10px'}}>Email</label>
                <input className="input" style={{width:'150px',height:'25px',borderRadius:'15px',paddingLeft:'10px',marginTop:'10px'}} name='email' type="email"  placeholder="email..." onChange={handleTextInput} />
              </div>
            </div>  
            <div style={{margin:'20px 0px',display:'grid',placeItems:'center'}}> 
            {error && <p style={{color:'red'}}>Error : {error}</p>}
            <button style={{margin:'0px auto',width:'fit-content',height:'fit-content',padding:'10px 15px',fontSize:'14px',borderRadius:'20px',backgroundColor:'transparent',borderColor:'none'}} type='submit'>Submit</button>
            </div>
            
         
      </form> 

        </div>
    )
}
export default SettingsComponent;