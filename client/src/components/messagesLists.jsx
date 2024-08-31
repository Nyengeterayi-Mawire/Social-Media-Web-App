import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";  
import { addMessage,setMessageList,deleteMessage } from "../features/meassages";  
import sendIcon from '../Send.png';
import axios from 'axios';
import { Link } from "react-router-dom";
import { LuSendHorizonal } from "react-icons/lu";


const MessagesLists = ({user,socket,contactInfo,viewMessages,onlineUsers}) => { 
    const[messageDetails,setMessageDetails] = useState({message:'',date:'',time:'',userName:user.username,userPhoto:''}) 
    const [messageText,setMessageText] = useState('');
    const messages = useSelector(state=>state.messages.value.messages);
    const token = useSelector(state=>state.user.value.token)
    const [messages1,setMessages1] = useState([]); 
    const [conversationID,setConversationID] =useState('0');
    const [profilePic,setProfilePic] = useState('');  
    const [username,setUsername] = useState(''); 
    const [contact,setContact] = useState({data:{id:'0'}});  
    const [isLodaing,setIsLoading] = useState(true);
    const [contactID,setContactID] = useState('');
    const dispatch = useDispatch(); 

    useEffect(()=>{
       
        dispatch(setMessageList([])) 
        setConversationID('0')
        if( Object.keys(contactInfo.contact).length !== 0){
            axios.post('/message/conversation/'+user._id,{userLoggedIn : user._id,contactToMessage :contactInfo.contact.data._id},{headers:{'Authorization': token}}).then(res=>{
                
                console.log('res conversation',res.data)  
                if(Object.keys(res.data).length !== 0){
                    setConversationID(res.data._id)
                    console.log('message convo id',res.data)
                    axios.get('/message/'+res.data._id,{headers:{'Authorization': token}}).then(response=>{
                        dispatch(setMessageList(response.data))
                        setIsLoading(false)})
                    
                }
                
            })
            setProfilePic(contactInfo.contact.data.photo);
            setUsername(contactInfo.contact.data.username); 
            setContact(contactInfo.contact);
            setContactID(contactInfo.contact.data._id);
            

        }  
        
      
        
    },[contactInfo])  

    useEffect(()=>{
        socket.on('sendMessage',data=>{
            console.log('message received',data) 
            dispatch(addMessage(data.details))
        })
    },[socket])  
    

    function enterMessage(e){
        setMessageText(e.target.value);
    } 

    function sendMessage(){ 
        console.log('converstaion Id',conversationID)
        axios.post('/message/sendmessage/'+conversationID,{
            messageText,
            senderID : user._id,  
            receiverID : contactInfo.contact.data._id,
            conversationID,
            date : new Date(),
            time : new Date().getHours() + ":" + new Date().getMinutes()
        },{headers:{'Authorization': token}}).then(res=>console.log('message sent',res.data))

        if(onlineUsers.filter(onlineUser=>onlineUser.userID === contactInfo.contact.data._id).length !== 0){
            socket.emit('sendMessage',{sendTo : onlineUsers.filter(onlineUser=>onlineUser.userID === contactInfo.contact.data._id)[0], details:{
                message :messageText,
                userName : user.username,
                senderID : user._id,  
                receiverID : contactInfo.contact.data._id,
                date : new Date(),
                time : new Date().getHours() + ":" + new Date().getMinutes()
        
            },from:user._id})
        }
        
        dispatch(addMessage({
            message :messageText,
            userName : user.username,
            senderID : user._id,  
            receiverID : contactInfo.contact.data._id,
            date : new Date(),
            time : new Date().getHours() + ":" + new Date().getMinutes()
    
        })); 
        setMessages1([...messages,{
            message :messageText,
            userName : user.username,
            date : new Date(),
            time : new Date().getHours() + ":" + new Date().getMinutes()
    
        }])
        
        setMessageDetails(''); 
        setMessageText('');
    } 

    return (
        <div className = "messagesList" style={viewMessages?{visibility:'visible',width:'73%'}:{visibility:'hidden'}}>
            <div style={{height:'10%',display:'flex',alignItems:'center',position:'relative'}}>
                {contactInfo.contact.length !== 0 && <div style={{marginLeft:'25px'}}> {profilePic ? <div>
                    <img src={profilePic} style={{width:'60px',height:'60px',borderRadius:'50%'}}></img>
                </div>: <div style={{width:'60px',height:'60px',borderRadius:'50%',backgroundColor:'grey'}}> </div>}</div>}
                <div style={onlineUsers.filter(online=>online.userID===contact.data._id).length !== 0?{width:'15px',height:'15px',borderRadius:'50%',backgroundColor:'green',position:'absolute',bottom:'10px',left:'70px'}:{width:'15px',height:'15px',borderRadius:'50%',backgroundColor:'red',position:'absolute',bottom:'10px',left:'70px'}}></div>
                <Link className="Link" to='/profile' state={contactID}><h3 style={{marginLeft:'10px'}}>{username}</h3></Link>
            </div>
            <div style={{borderTop:'1px solid grey',height:'80%',overflowY:'scroll',scrollbarWidth:'none' }}>
                   {messages.length !== 0 ? messages.map((message,index)=> {
                        return  user._id !== message.senderID?<div key={index} style={{display:'flex',padding:'0px 0px',width:'fit-content',position:'relative',alignItems:'flex-start',margin:'10px 30px 10px 10px'}}>
                            <div style={{padding:'10px',display:'flex',flexDirection:'column', maxWidth:'350px',backgroundColor:'#343a40',borderRadius:'0px 10px 10px 10px',height:'fit-content',margin:'0px 5px 10px 25px'}}>
                                <p style={{ width:'100%',margin:'0px 0px 5px 0px'}}>{message.userName}</p> 
                                <p style={{width:'100%',margin:'0px',height:'fit-content',maxWidth:'350px', display:'flex',flexWrap:'wrap'}}>{message.message}</p>
                            </div>  
                            
                            
                            <p >{message.time}</p>  
                            <button className="commentDeleteButton" style={{backgroundColor:'transparent',width:'30px',height:'30px',justifyContent:'center',alignItems:'center',borderRadius:'50%',border:'none',color:'grey',position:'absolute',bottom:'0px',left:'0px'}} onClick={()=> dispatch(deleteMessage(index))}><i class="fa-regular fa-trash-can"></i></button>
                            
                            
                        </div> : <div key={index} style={{display:'flex', justifyContent:'right',position:'relative' }}>
                            <div style={{display:'flex',padding:'0px 0px',margin:'10px 30px 10px 10px'}}>
                            <p style={{height:'fit-content'}}>{message.time}</p>
                            <button className="commentDeleteButton" style={{backgroundColor:'transparent',width:'30px',height:'30px',justifyContent:'center',alignItems:'center',borderRadius:'50%',border:'none',color:'grey',position:'absolute',right:'10px',bottom:'0px'}} onClick={()=> dispatch(deleteMessage(index))}><i class="fa-regular fa-trash-can"></i></button>

                            <div style={{padding:'10px',display:'flex',flexDirection:'column', maxWidth:'200px',backgroundColor:'#023e8a',borderRadius:'10px 0px 10px 10px',height:'fit-content',margin:'0px 5px 0px 5px'}}>
                                <p style={{width:'100%',margin:'0px 0px 5px 0px',textAlign:'end'}}>{message.userName}</p> 
                                <p style={{width:'100%',margin:'0px',height:'fit-content',maxWidth:'350px', display:'flex',flexWrap:'wrap'}}>{message.message}</p>
                            </div> 
                            
                        </div></div>
                    }):<div style={{height:'80%',display:'flex',justifyContent:'center',alignItems:'center'}}><p>There are no messages</p></div> }
            </div>  

            <div style={{height:'fit-content'}}> 
                <div style={{margin:'auto auto' ,width:'90%',display:'flex' }}>
                    <textarea className="inputButton" name='text' type='text' onChange={enterMessage} value={messageText} style={{width:'85%',margin:'auto',fontSize:'14px',height : '16px',maxHeight:'60px',backgroundColor:'transparent',border:'1px solid grey',borderRadius:'20px',padding:'10px 10px 10px 10px',color:'white',scrollbarWidth:'none'}}/>
                    <button className="sendMessage" onClick={sendMessage} style={{height:'fit-content',width:'fit-content',padding:'5px',border:'none',borderRadius:'50%',margin:'auto',display:'flex',justifyContent:'center',backgroundColor:'transparent'}}><LuSendHorizonal className="sendMessageIcon" size={'2em'} style={{margin:'auto',color:'grey'}}/></button> 
                    
                </div>
                
            </div>
        </div>
    )
} 
export default MessagesLists;