import { useState } from "react"; 
import { Link,useNavigate } from "react-router-dom"; 
import axios from 'axios'
const Register = () => {
    const [form,setForm] = useState({firstname:'',lastname:'',username:'',password:'',email:'',photo:''}); 
    const [error,setError] = useState('')
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value})
    } 

    const handleSubmit = (e) => {
        e.preventDefault();  
        console.log(form)
        if(form.firstname && form.lastname && form.username && form.password && form.email ){
            axios.post('/register',form).then(res=>{
                console.log(res)
            if(res.data.err){
                
                setError(res.data.err)
            }else{
                navigate('/login')
            }}); 
        }else if(!form.firstname){
            setError('Firstname field required')
        }else if(!form.lastname){
            setError('Lastname field required')
        }else if(!form.username){
            setError('Username field required')
        }else if(!form.password){
            setError('Password field required')
        }else if(!form.email){
            setError('Email field required')
        }
        
        
    }
    return(
        <div style={{ width:'100%',display:'flex'}}>
            <form class="form" onSubmit={handleSubmit} style={{margin:'auto ',justifyItems:'center'}}>
    <p class="title">Register </p>
    <p class="message">Signup now and get full access to our app. </p>
        <div class="flex">
        <label>
            <input class="input" type="text" name="firstname" onChange={handleChange} placeholder="" required=""/>
            <span>Firstname</span>
        </label>

        <label>
            <input class="input" type="text" name="lastname" onChange={handleChange} placeholder="" required=""/>
            <span>Lastname</span>
        </label>
    </div>  
            
    <label>
        <input class="input" type="email" name="email" onChange={handleChange} placeholder="" required=""/>
        <span>Email</span>
    </label> 
        
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
    <p class="signin">Already have an acount ?  <Link to='/login'>Login</Link> </p>
</form>

        </div>
    )
} 
export default Register;