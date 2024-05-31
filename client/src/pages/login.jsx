import { useState } from "react";  
import {Link,useNavigate} from 'react-router-dom'; 
import { useDispatch,useSelector } from "react-redux"; 
import { show } from "../features/navbarSlice"; 
import { setUser,setLogged, setToken ,setSocket } from "../features/userSlice";
import axios from 'axios'; 
import toast from "react-hot-toast";
const Login = ({socket}) => {
    const [form,setForm] = useState({username:'',password:''});  
    const [error,setError] = useState('') 
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 
   

    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value})
    } 

    const handleSubmit = async(e) => {
        e.preventDefault(); 
        console.log(form) 
        // axios.post('/register/login',form).then(res=>console.log(res));  
        if(form.password && form.username){
            const response = await fetch('/register/login',{
                method : 'POST', 
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(form)
            }) ;
            const res = await response.json();  
            
            if(res){ 
                if (res.err){
                    setError(res.err)
                }else{
                    dispatch(setUser(res.user));  
                    dispatch(setToken(res.token))
                    dispatch(setLogged());
                    navigate('/home'); 
                    dispatch(show());  
                    dispatch(setSocket({userID:res.user._id,username:res.user.username}))
                    // socket.on('connection');  
                    // socket.connect(); 
                    toast.success('Seccesfully logged in');
                    console.log('response',res)
                }
            }        
        }else if(!form.username){
            setError('Username required')
        }else if(!form.password){
            setError('Password required')
        }
    }
    
    return(
        <div className="Login" style={{ width:'100%',border:'1px solid blue',display:'flex'}}>
            <form class="form" onSubmit={handleSubmit} style={{margin:'auto ',justifyItems:'center'}}>
    <p class="title">Login </p>
    <p class="message">Log in and get socializing </p>
        
        
    <label>
        <input class="input" type="password" name="username" onChange={handleChange} placeholder="" required=""/>
        <span>Username</span>
    </label>
    <label>
        <input class="input" type="password" name="password" onChange={handleChange} placeholder="" required=""/>
        <span>Password</span>
    </label> 
    {error && <p style={{color:'red'}}>Error : {error}</p>}
    <button class="submit">Submit</button>
    <p class="signin">Do not have an account ? <Link to='/register'>Register</Link> </p>
</form>

        </div>
    )
    
} 
export default Login;