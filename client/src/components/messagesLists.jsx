import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";  
import { addMessage,setMessageList,deleteMessage } from "../features/meassages"; 
import axios from 'axios'


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
    const dispatch = useDispatch(); 

    useEffect(()=>{
        // socket.emit('privateMessage',data=>{
        //     // setMessages1([...messages,data])
        //     // dispatch(addMessage(data));
        // })   
        
        dispatch(setMessageList([])) 
        setConversationID('0')
        // Object.keys(contactInfo).length !== 0
        if( Object.keys(contactInfo.contact).length !== 0){
            axios.post('/message/conversation',{userLoggedIn : user._id,contactToMessage :contactInfo.contact.data._id},{headers:{'Authorization': token}}).then(res=>{
                
                console.log('res',res.data)  
                if(Object.keys(res.data).length !== 0){
                    setConversationID(res.data._id)
                    console.log('message convo id',res.data)
                    axios.get('/message/'+res.data._id,{headers:{'Authorization': token}}).then(response=>dispatch(setMessageList(response.data)))
                    // console.log('run this')
                }
                
            })
            setProfilePic(contactInfo.contact.data.photo);
            setUsername(contactInfo.contact.data.username); 
            setContact(contactInfo.contact)
            // console.log('runnningggg')

        }  
        
      
        
    },[contactInfo])  

    useEffect(()=>{
        socket.on('sendMessage',data=>{
            console.log('message received',data) 
            dispatch(addMessage(data.details))
        })
    },[socket])
    
    console.log('message list',messages)
    console.log('contact Info',contactInfo)

    function enterMessage(e){
        // setMessageDetails({...messageDetails,[e.target.name]:e.target.value}) 
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

        // socket.emit('privateMessage',{
        //     message :messageText,
        //     userName : user.username, 
        //     socketID : contactInfo.socket.socketID,
        //     date : new Date(),
        //     time : new Date().getHours() + ":" + new Date().getMinutes()
    
        // })
        if(contactInfo.socket){
            socket.emit('sendMessage',{sendTo : contactInfo.socket, details:{
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

//    console.log('contact info',contactInfo)
    return (
        <div className = "messagesList" style={viewMessages?{visibility:'visible',width:'73%'}:{visibility:'hidden'}}>
            <div style={{height:'10%',display:'flex',alignItems:'center',position:'relative'}}>
                {contactInfo.contact.length !== 0 && <div style={{marginLeft:'25px'}}> {profilePic ? <div>
                    <img src={profilePic} style={{width:'60px',height:'60px',borderRadius:'50%'}}></img>
                </div>: <div style={{width:'60px',height:'60px',borderRadius:'50%',backgroundColor:'grey'}}> </div>}</div>}
                {/* {contactInfo.length === 0 && <p>Display this</p>} */} 
                <div style={onlineUsers.filter(online=>online.userID===contact.data._id).length !== 0?{width:'15px',height:'15px',borderRadius:'50%',backgroundColor:'green',position:'absolute',bottom:'10px',left:'70px'}:{width:'15px',height:'15px',borderRadius:'50%',backgroundColor:'red',position:'absolute',bottom:'10px',left:'70px'}}></div>
                <h3 style={{marginLeft:'10px'}}>{username}</h3>
            </div>
            <div style={{borderTop:'1px solid grey',height:'80%',overflowY:'scroll',scrollbarWidth:'none' }}>
                   {messages.length !== 0 ? messages.map((message,index)=> {
                        return  user._id !== message.senderID?<div style={{display:'flex',padding:'0px 0px',width:'fit-content',position:'relative',alignItems:'flex-start',margin:'10px 30px 10px 10px'}}>
                            {/* <img style={{width:'40px',height:'40px',borderRadius:'50%'}}/>  */} 
                            {/* <div style={{height:'fit-content'}}>
                                <div style={{width:'40px',height:'40px',borderRadius:'50%',backgroundColor:'grey'}}></div>
                            </div> */}
                            <div style={{padding:'10px',display:'flex',flexDirection:'column', maxWidth:'350px',border:'1px solid blue',borderRadius:'0px 10px 10px 10px',height:'fit-content',margin:'0px 5px 10px 25px'}}>
                                <p style={{ width:'100%',margin:'0px 0px 5px 0px'}}>{message.userName}</p> 
                                <p style={{width:'100%',margin:'0px',height:'fit-content',maxWidth:'350px', display:'flex',flexWrap:'wrap'}}>{message.message}</p>
                            </div>  
                            
                            
                            <p >{message.time}</p>  
                            <button className="commentDeleteButton" style={{backgroundColor:'transparent',width:'30px',height:'30px',justifyContent:'center',alignItems:'center',borderRadius:'50%',border:'none',color:'grey',position:'absolute',bottom:'0px',left:'0px'}} onClick={()=> dispatch(deleteMessage(index))}><i class="fa-regular fa-trash-can"></i></button>
                            
                            
                        </div> : <div style={{display:'flex', justifyContent:'right',position:'relative' }}>
                            <div style={{display:'flex',padding:'0px 0px',margin:'10px 30px 10px 10px'}}>
                            {/* <img style={{width:'40px',height:'40px',borderRadius:'50%'}}/>  */} 
                            <p style={{height:'fit-content'}}>{message.time}</p>
                            <button className="commentDeleteButton" style={{backgroundColor:'transparent',width:'30px',height:'30px',justifyContent:'center',alignItems:'center',borderRadius:'50%',border:'none',color:'grey',position:'absolute',right:'10px',bottom:'0px'}} onClick={()=> dispatch(deleteMessage(index))}><i class="fa-regular fa-trash-can"></i></button>

                            <div style={{padding:'10px',display:'flex',flexDirection:'column', maxWidth:'200px',border:'1px solid blue',borderRadius:'10px 0px 10px 10px',height:'fit-content',margin:'0px 5px 0px 5px'}}>
                                <p style={{width:'100%',margin:'0px 0px 5px 0px',textAlign:'end'}}>{message.userName}</p> 
                                <p style={{width:'100%',margin:'0px',height:'fit-content',maxWidth:'350px', display:'flex',flexWrap:'wrap'}}>{message.message}</p>
                            </div> 
                            
                            {/* <div style={{height:'fit-content'}}>
                                <div style={{width:'40px',height:'40px',borderRadius:'50%',backgroundColor:'grey'}}></div>
                            </div> */}
                        </div></div>
                    }):<div><p>There are no messages</p></div>}
            </div>  
            {/* <div>
                {Object.keys(contactInfo).length !== 0 && <h2>This is {contactInfo.contact.username} chat window</h2>}
            </div> */}
            <div style={{height:'fit-content'}}> 
                <div style={{margin:'auto auto' ,width:'70%' }}>
                    <input name='text' type='text' onChange={enterMessage} value={messageText} style={{width:'70%', height:'20px'}}/>
                    <button onClick={sendMessage}>Send</button>
                </div>
                
            </div>
        </div>
    )
} 
export default MessagesLists;