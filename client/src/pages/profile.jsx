import Navbar from "../components/navbar" ;
import ProfileComp from "../components/profileComp"; 
import NavbarUpdate from "../components/navbarUpdate";
import { useState,useEffect } from "react"; 
import { useLocation } from "react-router-dom"; 
import { useSelector } from "react-redux";
import axios from 'axios';


const Profile = () => {   
    const token = useSelector(state=>state.user.value.token)
    const [user,setUser] = useState({}); 
    const [postList,setPostList] = useState([]); 
    const location = useLocation();  
    const id = location.state; 
    

   
    // console.log('state passed',id)


    useEffect(()=>{
        
        
        console.log('state passed',id)
        axios.get(`/register/${id}`,{headers:{'Authorization': token}}).then(res=>setUser(res.data));  
        axios.get(`/post/userPostList/${id}`,{headers:{'Authorization': token}}).then(res=>setPostList(res.data));
         

    },[id]) 
    // console.log('user info', user)
    console.log('postList info', postList)
    return(
        <div className="profile" style={{width:'70%',margin:'auto auto',borderRight:'1px solid grey',borderLeft:'1px solid grey'}}>
            {/* <NavbarUpdate user={user}/> */}
            <Navbar user={user}/>
            <ProfileComp user={user} postList={postList}/>
            
            
            
        </div>
    )
} 
export default Profile;