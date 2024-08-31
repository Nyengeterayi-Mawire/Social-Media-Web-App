import Navbar from "../components/navbar"; 
import MessageContactsComp from "../components/messageContactsComp"; 
import { useSelector,useDispatch } from "react-redux"; 
import { useState,useEffect } from "react";
import { setOnline,addOnline } from "../features/meassages"; 
import axios from 'axios';

const MessageContacts=({socket})=>{ 
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
            setNewLogin(data); 
            dispatch(addOnline(([data])))
        }) 
        socket.on('sendMessage',data=>{
            console.log('new message',data)
        })
    },[socket]) 

    return(         
        <div className="messageContacts" style={{width:'70%',margin:'auto auto',borderRight:'1px solid rgb(58,59,60)',borderLeft:'1px solid rgb(58,59,60)'}}>
            <MessageContactsComp user={user} socket={socket} onlineUsers={onlineUsers}/> 
        </div>
    )
} 
export default MessageContacts;