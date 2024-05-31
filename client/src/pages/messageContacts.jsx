import Navbar from "../components/navbar"; 
import MessageContactsComp from "../components/messageContactsComp"; 
import { useSelector,useDispatch } from "react-redux"; 
import { useState,useEffect } from "react";
import { setOnline,addOnline } from "../features/meassages"; 
import axios from 'axios';

// import MessagesLists from "../components/messagesLists";
const MessageContacts=({socket})=>{ 
    // const [onlineUsers,setOnlineUsers] = useState([]);
    const dispatch = useDispatch() ;
    const onlineUsers = useSelector(state => state.messages.value.online);
    const token = useSelector(state=>state.user.value.token)

    const [newLogin,setNewLogin] = useState({});
    const user = useSelector(state=>state.user.value.user) 
      

    useEffect(()=>{
        axios.get('/socket').then(res=>dispatch(setOnline((res.data))))
    },[]) 
 

    useEffect(()=>{
        socket.on('newLogin', data=> { 
            console.log('new logIn',data)
            setNewLogin(data); 
            dispatch(addOnline(([data])))
        }) 
        socket.on('sendMessage',data=>{
            console.log('new message',data)
        })
    },[socket]) 
    console.log('user -----',user)
    return( 
        
        <div className="messageContacts" style={{width:'70%',margin:'auto auto',borderRight:'1px solid grey',borderLeft:'1px solid grey'}}>
            {/* <Navbar user={user}></Navbar>  */} 
            
            <MessageContactsComp user={user} socket={socket} onlineUsers={onlineUsers}/> 
            
            

        </div>
    )
} 
export default MessageContacts;