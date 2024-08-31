import { useDispatch,useSelector } from "react-redux"; 
 import {hide} from '../features/navbarSlice';
 import {Link,useNavigate} from 'react-router-dom'; 
 import { useEffect ,useState} from "react";  


const NavbarUpdate = ({user}) => {  
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    
    const show = useSelector(state => state.navbar.value.leftNavbar);  
    const userLoggedIn = useSelector(state => state.user.value.user); 
    const showProfile = useSelector(state => state.navbar.value.search);

    return (
        <div className="NavbarUpdate">
             <div className="userInfo" style={!showProfile?{visibility:'visible',margin:'auto ',marginTop:'0px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{visibility:'hidden'}}> 
                <h3>PROFILE</h3>
                <img alt='profile pic' src={user.photo} style={{margin:'auto ',width:'120px',height:'120px',borderRadius:'50%'}}></img>  
                <p>{user.username}</p>
                {/* <div > 
                </div> */}
            </div>
             <div style={userLoggedIn._id===user._id?{visibility:'hidden'}:{visibility:'visible'}}>
                {userLoggedIn.following.includes(user._id)?<div><button>Following</button>
                <button>Message</button></div>:<div><button >Follow</button> <button>Message</button></div>}
            </div>            
        </div>
    )
} 

export default NavbarUpdate