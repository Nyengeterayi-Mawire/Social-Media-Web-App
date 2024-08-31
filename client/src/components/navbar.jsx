 import { useDispatch,useSelector } from "react-redux"; 
 import {hide,showFollowers,showFollowing } from '../features/navbarSlice';
 import {Link,useNavigate} from 'react-router-dom'; 
 import { useEffect ,useState} from "react";  
 import { addFriend,removeFriend, addContact } from "../features/userSlice";
 import axios from "axios";  
 import toast from 'react-hot-toast';  
 
 const Navbar = ({user}) => { 
    const navigate = useNavigate();
    const dispatch = useDispatch();    
    const show = useSelector(state => state.navbar.value.leftNavbar);  
    const userLoggedIn = useSelector(state => state.user.value.user); 
    const showProfile = useSelector(state => state.navbar.value.search); 
    const token = useSelector(state=>state.user.value.token)   
    const onlineUsers = useSelector(state=>state.messages.value.online);  
    const socket = useSelector(state => state.user.value.socket);
    const [numberFollowing,setNumberFollowing] = useState([]); 
    const [numberFollowers,setNumberFollowers] = useState([]); 
  
    useEffect(()=>{
        socket.on('follow',data=>{
            toast.success(`${data} started following you`)
        }) 
        socket.on('unFollow',data=>{
            toast.success(`${data}  unfollowed you`)
        })  
        setNumberFollowers(user.followers) 
        setNumberFollowing(user.following)
    },[socket,user])  

   

    const handleFollowCLick = () => {
        axios.patch('/register/add/'+ userLoggedIn._id,{ followerID : user._id },{headers:{'Authorization': token}})
        dispatch(addFriend(user._id)); 
        setNumberFollowers(state=>state = [...state, user._id]) 
        const  isUserOnline = onlineUsers.filter(online=>online.userID === user._id); 
        if (isUserOnline.length !== 0){ 
            socket.emit('follow',{socketID : isUserOnline[0].socketID, follower:userLoggedIn.username})
        }
        
    }

    const handleUnFollowCLick = () => {
        axios.patch('/register/remove/'+ userLoggedIn._id,{ followerID : user._id },{headers:{'Authorization': token}})
        dispatch(removeFriend(user._id)); 
        setNumberFollowers(numberFollowers.filter(followerID => followerID !== user._id))
        const  isUserOnline = onlineUsers.filter(online=>online.userID === user._id); 
        if (isUserOnline.length !== 0){ 
            // console.log('sendng.....',isUserOnline)
            socket.emit('unFollow',{socketID : isUserOnline[0].socketID, follower:userLoggedIn.username})
        }
    }

    const displayFollowersHandle=()=>{
        dispatch(showFollowers(false)); 
        dispatch(showFollowing(true));
    } 

    const handleMessageCLick=()=>{
        const contactExistInContactList = userLoggedIn.messaging.filter(userID=>userID === user._id);
        if(contactExistInContactList.length === 0){            
            axios.patch('/register/addcontact/'+userLoggedIn._id,{contact:user._id},{headers:{'Authorization': token}}).then(res=>{
            if(res.data.err){
                console.log('err',res.data.err)
            }else{
                dispatch(addContact(user._id))
                navigate('/messages');
            }
            
        })
        }
        navigate('/messages');
        
    }

    return(
        <div className="Navbar" style={show===true?{display:'initial,',padding:'20px 0px'}:{display:'none'}}>  
            <div className="userInfo" style={!showProfile?{visibility:'visible',margin:'auto ',marginTop:'0px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{visibility:'hidden'}}> 
                <h3>PROFILE</h3>
                {user.photo?<img alt='profile pic' src={user.photo} style={{margin:'auto ',width:'120px',height:'120px',borderRadius:'50%'}}></img>:<div style={{margin:'auto ',width:'120px',height:'120px',borderRadius:'50%',backgroundColor:'grey'}}></div>}  
                <h3>{user.username}</h3>
                <div > 
                    <div  style={{display:'inline-block',padding:'0px 10px',marginLeft:'7px'}}> 
                        <button className="following" style={{borderRadius: '20px',border:'0px',backgroundColor: 'transparent',color:'rgb(176 179 184)'}} onClick={()=>{
                            dispatch(showFollowers(false))
                            dispatch(showFollowing(true))}}>
                        <p style={{color:'rgb(176 179 184)'}}>Following</p>
                        {numberFollowing  ? <p> {numberFollowing.length}</p> : <p>0</p>}  
                        </button>
                        
                    </div>
                    <div style={{display:"inline-block",padding:'0px 0px'}}>
                        <button className="Followers" style={{borderRadius: '20px',border:'0px',backgroundColor: 'transparent',color:'rgb(176 179 184)'}}  onClick={ ()=>{
                            dispatch(showFollowing(false))
                            dispatch(showFollowers(true))
                            }}>
                        <p>Followers</p>
                        {numberFollowers  ? <p> {numberFollowers.length}</p> : <p>0</p>}  
                        </button>
                    </div>
                    
                </div>
            </div>
             <div style={userLoggedIn._id===user._id?{visibility:'hidden'}:{visibility:'visible'}}>
            
            
                {userLoggedIn && userLoggedIn.following.filter((follow)=>follow === user._id).length !== 0?<div className='followFollowing' ><button onClick={handleUnFollowCLick} style={!showProfile?{display:'initial'}:{display:'none'}}>Unfollow</button>
                <button onClick={handleMessageCLick} style={!showProfile?{display:'initial'}:{display:'none'}}>Message</button></div>:<div className='followFollowing'><button onClick={handleFollowCLick} style={!showProfile?{display:'initial'}:{display:'none'}} >Follow</button> <button onClick={handleMessageCLick} style={!showProfile?{display:'initial'}:{display:'none'}}>Message</button></div>}
            </div> 

       </div>
    )
 }
 export default Navbar;