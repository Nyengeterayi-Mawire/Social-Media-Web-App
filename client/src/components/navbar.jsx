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
    const [followFollowing,setFollowFollowing] = useState([]);
    // const [user,setUser] = useState({});
    const show = useSelector(state => state.navbar.value.leftNavbar);  
    const userLoggedIn = useSelector(state => state.user.value.user); 
    const showProfile = useSelector(state => state.navbar.value.search); 
    const token = useSelector(state=>state.user.value.token) 
    const displayFollowers = useSelector(state => state.navbar.value.showFollowers); 
    const displayFollowing = useSelector(state => state.navbar.value.showFollowing); 
    const onlineUsers = useSelector(state=>state.messages.value.online);  
    const socket = useSelector(state => state.user.value.socket);
    const [numberFollowing,setNumberFollowing] = useState(user.following); 
    const [numberFollowers,setNumberFollowers] = useState(user.followers); 
    const [followingList,setFollowingList] = useState([]);
    const [followersList,setFollowersList] = useState([]);
     
    console.log('token is',token)
    useEffect(()=>{
        socket.on('follow',data=>{
            toast.success(`${data} started following you`)
        }) 
        socket.on('unFollow',data=>{
            toast.success(`${data}  unfollowed you`)
        })  
        console.log('user to fetch',user)
        // if(user.following){
        //     Promise.all(user.following.map(following=>axios.get('/register/'+following))).then(res=>{
        //         console.log('all of the followers',res);
        //         setFollowingList(res);
        //     }) 
            
        // }
        // if(user.followers){
        //     Promise.all(user.followers.map(following=>axios.get('/register/'+following))).then(res=>{
        //         console.log('all of the following users',res);
        //         setFollowersList(res);
        //     })
        // }
        
    },[socket,user])  

    // console.log('following following',userLoggedIn) 
    // console.log('user to follow',user)

    

    const handleFollowCLick = () => {
        axios.patch('/register/add/'+ userLoggedIn._id,{ followerID : user._id },{headers:{'Authorization': token}}).then(res=>{
            // console.log('successfully added friend',res.data);
        })
        dispatch(addFriend(user._id)); 
        const  isUserOnline = onlineUsers.filter(online=>online.userID === user._id); 
        if (isUserOnline.length !== 0){ 
            // console.log('sendng.....',isUserOnline)
            socket.emit('follow',{socketID : isUserOnline[0].socketID, follower:userLoggedIn.username})
        }
        
    }

    const handleUnFollowCLick = () => {
        axios.patch('/register/remove/'+ userLoggedIn._id,{ followerID : user._id },{headers:{'Authorization': token}}).then(res=>{
            console.log('successfully unadded friend',res.data);
        })
        dispatch(removeFriend(user._id)); 
        const  isUserOnline = onlineUsers.filter(online=>online.userID === user._id)[0]; 
        if (isUserOnline){ 
            // console.log('sendng.....',isUserOnline)
            socket.emit('unFollow',{socketID : isUserOnline[0].socketID, follower:userLoggedIn.username})
        }
    }

    const displayFollowersHandle=()=>{
        dispatch(showFollowers(false)); 
        dispatch(showFollowing(true));
    } 

    const handleMessageCLick=()=>{
        axios.patch('/register/addcontact/'+userLoggedIn._id,{contact:user._id},{headers:{'Authorization': token}}).then(res=>{
            // console.log('added to message',res.data); 
            if(res.data.err){
                console.log('err',res.data.err)
            }else{
                dispatch(addContact(user._id))
                navigate('/messages');
            }
            
        })
        // dispatch(addContact(user._id))
        // navigate('/messages');
    }
    // console.log('online users',onlineUsers); 
    // console.log('user in data management',userLoggedIn); 
    // console.log('number of following',numberFollowing);
    // console.log('number of followers',numberFollowers)
    return(
        <div className="Navbar" style={show===true?{display:'initial,',padding:'20px 0px'}:{display:'none'}}>  
            <div className="userInfo" style={!showProfile?{visibility:'visible',margin:'auto ',marginTop:'0px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{visibility:'hidden'}}> 
                <h3>PROFILE</h3>
                {user.photo?<img alt='profile pic' src={user.photo} style={{margin:'auto ',width:'120px',height:'120px',borderRadius:'50%'}}></img>:<div style={{margin:'auto ',width:'120px',height:'120px',borderRadius:'50%',backgroundColor:'grey'}}></div>}  
                <h3>{user.username}</h3>
                <div > 
                    <div style={{display:'inline-block',padding:'0px 10px',marginLeft:'7px'}}> 
                        <button style={{borderRadius: '20px',border:'0px',backgroundColor: 'transparent',color:'rgb 176 179 184'}} onClick={()=>{
                            dispatch(showFollowers(false))
                            dispatch(showFollowing(true))}}>
                        <p>Following</p>
                        {user.following  ? <p> {user.following.length}</p> : <p>0</p>}  
                        </button>
                        
                    </div>
                    <div style={{display:"inline-block",padding:'0px 0px'}}>
                        <button style={{borderRadius: '20px',border:'0px',backgroundColor: 'transparent',color:'rgb 176 179 184'}}  onClick={ ()=>{
                            dispatch(showFollowing(false))
                            dispatch(showFollowers(true))
                            }}>
                        <p>Followers</p>
                        {user.followers ?<p>{user.followers.length}</p>:<p>0</p>} 
                        </button>
                    </div>
                    
                </div>
            </div>
             <div style={userLoggedIn._id===user._id?{visibility:'hidden'}:{visibility:'visible'}}>
                {/* {followFollowing.length===0?<div><button>Follow</button>
                <button>Message</button></div>:<div>
                    {userLoggedIn.following.includes(user._id)?<div><button>Following</button>
                <button>Message</button></div>:<div><button onClick={()=>{console.log('dispatch add friend to user')}}>Follow</button> <button>Message</button></div>}</div>} */}
            
            
                {userLoggedIn && userLoggedIn.following.filter((follow)=>follow === user._id).length !== 0?<div className='followFollowing' ><button onClick={handleUnFollowCLick} style={!showProfile?{display:'initial'}:{display:'none'}}>Unfollow</button>
                <button onClick={handleMessageCLick} style={!showProfile?{display:'initial'}:{display:'none'}}>Message</button></div>:<div className='followFollowing'><button onClick={handleFollowCLick} style={!showProfile?{display:'initial'}:{display:'none'}} >Follow</button> <button onClick={handleMessageCLick} style={!showProfile?{display:'initial'}:{display:'none'}}>Message</button></div>}
            </div> 

            {/* <div className="followersFollowingWidget" style={displayFollowing?{display:'initial',margin:'auto ',marginTop:'0px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{display:'none'}}>
                <h2>Following</h2>  
                {followingList && followingList.map(userIfollow=>{
                    return    <Link to='/profile' className="Link" state={userIfollow.data._id}> <div style={{ display:'flex', margin:'10px 0px'}}>
                                {userIfollow.data.photo?<img alt='profile pic' src={userIfollow.data.photo} style={{width:'30px',height:'30px',borderRadius:'50%',marginLeft:'10px'}}></img> : <div style={{width:'50px',height:'50px',borderRadius:'50%',marginLeft:'10px',backgroundColor:'grey'}}><i class="fa-solid fa-user" style={{margin:'auto auto'}}></i></div> }
                                <h3>{userIfollow.data.username}</h3>
                            </div></Link>                    
                })} 
            </div>
            <div className="followersFollowingWidget" style={ displayFollowers?{display:'initial',margin:'auto ',marginTop:'0px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{display:'none'}}>
                <h2>Followers</h2>  
                {followersList && followersList.map(userIfollow=>{
                    return    <Link to='/profile' className="Link" state={userIfollow.data._id}> <div style={{ display:'flex', margin:'10px 0px'}}>
                                {userIfollow.data.photo?<img alt='profile pic' src={userIfollow.data.photo} style={{width:'30px',height:'30px',borderRadius:'50%',marginLeft:'10px'}}></img> : <div style={{width:'50px',height:'50px',borderRadius:'50%',marginLeft:'10px',backgroundColor:'grey'}}><i class="fa-solid fa-user" style={{margin:'auto auto'}}></i></div> }
                                <h3>{userIfollow.data.username}</h3>
                            </div></Link>                    
                })} 
            </div> */}
            
            {/* <ul style={!showProfile?{visibility:'visible',width:'70%'}:{visibility:'hidden'}}> 
                <li><Link className="Link" to='/home'>Home</Link></li> 
                <li><Link className="Link"> Search</Link></li>
                <li><Link className="Link"  state={userLoggedIn._id} to='/profile'>Profile</Link></li> 
                <li><Link className="Link">Profile</Link></li> 
                <li><Link className="Link">Messages</Link></li> 
                <li><Link className="Link" to='/settings'>Settings</Link></li> 
            </ul> */}
            {/* <button onClick={()=>{
                dispatch(hide());
                navigate('/login')
            }} style={!showProfile?{visibility:'visible'}:{visibility:'hidden'}}>Logout</button>
             */}
        </div>
    )
 }
 export default Navbar;