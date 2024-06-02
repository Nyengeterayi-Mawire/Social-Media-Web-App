import { useState,useEffect } from "react"; 
import { useSelector } from "react-redux";
import axios from 'axios'; 
import toast from "react-hot-toast";

const Comments = ({postID,post,userID}) => { 
    // console.log('comments',comments) 
    const token = useSelector(state=>state.user.value.token) 
    const socket = useSelector(state => state.user.value.socket);
    const onlineUsers = useSelector(state => state.messages.value.online);
    const user = useSelector(state=>state.user.value.user);  
    

    const [commentText,setCommentText] = useState(''); 
    const [newComment,setNewComment]= useState({})
    const [commentsList, setCommentsList] = useState([]);  
    const [userList,setUserList] = useState([]);
    const [wait,setWait] = useState(true);
    const [isLoading,setIsLoading] = useState(true);
    
    useEffect (()=>{
        axios.get('/comment/'+postID,{headers:{'Authorization': token}}).then(res=>{
            setCommentsList(res.data)
            setWait(false) 
            
        } )  
        
       
        
       
       
    },[postID]) 

    useEffect(()=>{
        Promise.all(commentsList.map(comment=>axios.get('/register/'+comment.userID,{headers:{'Authorization': token}}))).then(res=>{
            setUserList(res)
            setIsLoading(false)});
        
    },[wait]) 

    useEffect(()=>{ 
        if(Object.keys(newComment).length !== 0){
            if (userList.filter(user=>user.data._id === newComment.userID).length === 0){
                axios.get('/register/'+newComment.userID,{headers:{'Authorization': token}}).then(res=>{
                    setUserList([...userList,res]) 
                    setCommentsList([newComment,...commentsList])
                }) 
            }else{ 
                console.log('comment to be addes',newComment)
                setCommentsList([newComment,...commentsList])
            }
            
        } 
        console.log('cooo',commentsList)
       
    },[newComment])

    const handleCommentSubmit =() => {
        console.log('this is the message',{postID,userID,text:commentText}) 
        setCommentText('')
        axios.post('/comment/add/'+postID,{postID,userID,text:commentText},{headers:{'Authorization': token}}).then(res=>{
            if(res.data.err){
                console.log('there was error',res.data.err)
            }else{
                setNewComment(res.data)
                socket.emit('commentNotification',{userID:user._id ,username:user.username,userLiked:onlineUsers.filter( onlineUser => onlineUser.userID === post.userID)[0] })
            }
        })
    } 
    
    
    const handleComentDelete = (commentID) => {
        axios.delete('/comment/delete/'+commentID,{headers:{'Authorization':token}},{postID},).then(res=>{
           
            console.log('comment delete err',res.data) 
            toast.success('Deleted comment',{style:{
                backgroundColor:'rgb(58,59,60)',
                color:'#fff',             
              }})
            // const newList = commentsList.filter(comment=>comment._id !== commentID) 
            setCommentsList(commentsList.filter(comment=>comment._id !== commentID))
            
        })
        
    }

    console.log('user lsit',userList)
    console.log('coments lsit',commentsList)
    return (
        <div className="comments" style={{width:'35%'}}>
            <h2 style={{textAlign:'center'}}>Comments</h2>  
            <div style={{margin:'0px 0px 10px 0px'}}>
                <input style={{backgroundColor:'transparent',borderRadius:'10px',height:'30px'}} onChange={e=>setCommentText(e.target.value)} value={commentText}></input> 
                <button onClick={handleCommentSubmit}>send</button>
            </div> 
            <div style={{maxHeight:'80%',overflowX:'scroll',scrollbarWidth:'none'}}>
            {commentsList && !isLoading ? commentsList.map((comment) => { 
                
                const user = userList.filter(user=>user.data._id === comment.userID)[0]
                console.log('user ', user)
                return <div style={{display:'flex',margin:'5px 0px 5px 10px',width:'90%',position:'relative'}}>
                    {/* <p>{userList.filter(user=>)}</p> */} 
                    {user && user.data.photo ? <img src={user && user.data.photo} style={{width:'40px',height:'40px', borderRadius:'50%'}}/>:<div style={{width:'40px',height:'40px', borderRadius:'50%',backgroundColor:'grey'}}></div>}
                    <div style={{height:'fit-content',margin:'0px 5px'}}>
                        <p style={{margin:'0px 0px 5px 0px'}}>{user&&user.data.username}</p>
                        <p style={{margin:'0px 0px 5px 0px',maxWidth:'135px',display:'flex',flexWrap:'wrap'}} >{comment.text}</p>
                    </div> 
                    <div style={{position:'absolute',right:'0px',top:'0px'}}>
                        {userID === comment.userID && <button className="commentDeleteButton" onClick={()=>handleComentDelete(comment._id)} style={{backgroundColor:'transparent',width:'30px',height:'30px',justifyContent:'center',alignItems:'center',borderRadius:'50%',border:'none',color:'grey'}}><i  className="fa-regular fa-trash-can" style={{margin:'auto'}}></i></button>}
                    </div>
                </div>
            }):<div style={{height:'inherit',display:'flex',justifyContent:'center',position:'relative'}}>
            <div class="spinner" >
                    <div></div>   
                    <div></div>    
                    <div></div>    
                    <div></div>    
                    <div></div>    
                    <div></div>    
                    <div></div>    
                    <div></div>    
                    <div></div>    
                    <div></div>    
                </div>
            </div>} 
            </div>
        </div>
    )
} 
export default Comments;