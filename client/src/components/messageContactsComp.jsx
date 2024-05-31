import MessagesLists from "../components/messagesLists"; 
import { useState,useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
const MessageContactsComp = ({onlineUsers,socket,user}) => { 
    const token = useSelector(state=>state.user.value.token)

    const [contactTomessage,setContactTomessage] = useState({contact:{}});
    const [viewMessages,setViewMessages] = useState(false); 
    const [followedUsers,setFollowedUsers] =useState([]); 
    
    // console.log('these are the online users',onlineUsers)  

    useEffect(()=>{
        
        Promise.all(user.messaging.map(followedUser=>axios.get('/register/'+followedUser,{headers:{'Authorization': token}}))).then(res=>setFollowedUsers(res))
        // user.following.map(followedUser=>console.log('following user',followedUser))
    },[]) 
    
    useEffect(()=>{
        socket.on('sendMessage',data=>{ 
            console.log('running')
            if (followedUsers){
                if(followedUsers.filter(user=>user._id !== data.from)){
                    axios.get('/register/'+data.from,{headers:{'Authorization': token}}).then(res=>setFollowedUsers([...followedUsers,res])) 
                }
            }
            // if (followedUsers.includes(data.from) === false){ 
            //     console.log('running 2')
            //     axios.get('/register/'+data.from).then(res=>setFollowedUsers([...followedUsers,res])) 
            //     console.log(followedUsers.includes(data.from))
            // }
        })
    },[socket])

    const handleMessageClick = (contact) => {
        // console.log('button value',contact);
        setContactTomessage({contact: contact, socket:onlineUsers.filter(online=>online.userID===contact.data._id)[0]}) 
        setViewMessages(true);
        // console.log('button value',contactTomessage);
    } 
    // console.log('the ofline/online users',onlineUsers);
    // console.log('followed users',followedUsers);
    return (
        <div className="messageContactsComp" style={{width:'100%'}} >  
            <div className="messageContactsNavbar" style={{justifyContent:'center'}}>
                <div style={{textAlign:'center'}}>  
                <div style={{borderBottom:'1px solid grey',padding:'0px 0px 3.5px 0px'}}>
                <h2 style={{height:'inherit'}}>Contacts</h2>
                </div>
                    
                {followedUsers && followedUsers.map((contact)=>{ 
                    // const userconnected = onlineUsers.filter(online=>online.userID===contact._id)[0]
                    return <div className="contactHoverDiv" style={{display:'flex' , borderBottom:'1px solid grey',margin:'auto',padding:'10px 0px 10px 0px' ,position:'relative'}}> 
                        
                        {contact.data.photo?<img src={contact.data.photo} alt='Profile Pic' style={{width:'50px', height:'50px',borderRadius:'50%',marginLeft:'10px'}}/> : <div style={{width:'50px', height:'50px',borderRadius:'50%',backgroundColor:'grey',marginLeft:'10px'}}/>}
                        <div> 
                            <p style={{marginLeft:'10px'}}>{contact.data.username}</p>
                        </div> 
                        {/* <div>
                            <div style={onlineUsers.filter(online=>online.userID===contact.data._id).length !== 0?{width:'15px',height:'15px',borderRadius:'50%',backgroundColor:'green'}:{width:'15px',height:'15px',borderRadius:'50%',backgroundColor:'red'}}></div>
                        </div>  */}
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