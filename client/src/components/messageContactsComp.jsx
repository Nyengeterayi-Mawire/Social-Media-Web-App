import MessagesLists from "../components/messagesLists"; 
import { useState,useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
const MessageContactsComp = ({onlineUsers,socket,user}) => { 
    const token = useSelector(state=>state.user.value.token);
    const showProfile = useSelector(state => state.navbar.value.search); 
    const [contactTomessage,setContactTomessage] = useState({contact:{}});
    const [viewMessages,setViewMessages] = useState(false); 
    const [followedUsers,setFollowedUsers] =useState([]); 

    useEffect(()=>{        
        Promise.all(user.messaging.map(followedUser=>axios.get('/register/'+followedUser,{headers:{'Authorization': token}}))).then(res=>setFollowedUsers(res))
    },[user]) 
    
    useEffect(()=>{
        socket.on('sendMessage',data=>{ 
            if (followedUsers){
                if(user.messaging.filter(contact => contact === data.from).length === 0){
                    axios.get('/register/'+data.from,{headers:{'Authorization': token}}).then(res=>setFollowedUsers([...followedUsers,res])) 
                }
            }
        })
    },[socket])

    const handleMessageClick = (contact) => {
        setContactTomessage({contact: contact, socket:onlineUsers.filter(online=>online.userID===contact.data._id)[0]}) 
        setViewMessages(true);
        
    } 
   
    return (
        <div className="messageContactsComp" style={{width:'100%'}} >  
            <div className="messageContactsNavbar" style={{justifyContent:'center',height:'100%'}}>
                <div style={!showProfile?{display:'initial',textAlign:'center'}:{display:'none'}}>  
                    <div style={{borderBottom:'1px solid grey',padding:'0px 0px 3.5px 0px'}}>
                    <h2 style={{height:'inherit'}}>Contacts</h2>
                    </div>
                    
                {followedUsers && followedUsers.map((contact)=>{ 
                    return <div className="contactHoverDiv" style={{display:'flex' , borderBottom:'1px solid grey',margin:'auto',padding:'10px 0px 10px 0px' ,position:'relative'}}> 
                        
                        {contact.data.photo?<img src={contact.data.photo} alt='Profile Pic' style={{width:'50px', height:'50px',borderRadius:'50%',marginLeft:'10px'}}/> : <div style={{width:'50px', height:'50px',borderRadius:'50%',backgroundColor:'grey',marginLeft:'10px'}}/>}
                        <div> 
                            <p style={{marginLeft:'10px'}}>{contact.data.username}</p>
                        </div> 
                        <button  onClick={()=>handleMessageClick(contact) }style={{position:'absolute',right:'0px',top:'30%'}}>Message</button>
                        
                    </div>
                })}
                </div>
            </div>
            <MessagesLists socket={socket} user={user} contactInfo={contactTomessage} viewMessages={viewMessages} onlineUsers={onlineUsers}/>
        </div>
    )
} 
export default MessageContactsComp;