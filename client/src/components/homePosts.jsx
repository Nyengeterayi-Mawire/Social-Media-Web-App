import { useState,useEffect } from "react";
import axios from 'axios' 
import { useDispatch, useSelector } from "react-redux"; 
import { addLike,addComment } from "../features/userSlice"; 
import { Link } from "react-router-dom";

const HomePosts = ({user,postsList}) => { 
    const [likeButton,setLikeButton] = useState(false); 
    const [commentButton,setCommentButton] = useState(false);  
    const [commentText,setCommentText] = useState('') ; 
    const [userList,setUserList] = useState([]); 
    const [loading,setLoading] = useState(true);
    const socket = useSelector(state => state.user.value.socket);
    const onlineUsers = useSelector(state => state.messages.value.online); 
    const token = useSelector(state=>state.user.value.token)
    const dispatch = useDispatch();
     
    const [userCommentingData,setUseCommentingData] = useState({userID:`${user._id}`,username:user.username, photo: user.photo,comment:''})

    useEffect(()=>{
        Promise.all(postsList.map(post=>axios.get('/register/'+post.userID,{headers:{'Authorization': token}}))).then(data=>{
            setUserList(data)
            setLoading(false)
            console.log('ended',data)})
            
    },[postsList])

   
    const handleLikeButtonClick =(post,index)=> {
        axios.patch('/post/addLike/'+post._id,user,{headers:{'Authorization': token}}).then(res=>console.log(res));  
        if( onlineUsers.filter(onlineUser => onlineUser.userID === post.userID ).length !== 0){
            socket.emit('likeNotification',{userID:user._id,username:user.username ,userLiked:onlineUsers.filter( onlineUser => onlineUser.userID === post.userID)[0] }) 
        } 
        
        dispatch(addLike({id:user._id,index}));
        setLikeButton(!likeButton);
    } 

    const handleSubmitComment = (post) => { 
        if(commentText && commentText.trim() !== ''){ 
            console.log('comment',{postID:post._id,userID:user._id,text:commentText});
            axios.post('/comment/add/'+post._id,{headers:{'Authorization': token}},{postID:post._id,userID:user._id,text:commentText}); 
            if( onlineUsers.filter(onlineUser => onlineUser.userID === post.userID)){
                socket.emit('commentNotification',{userID:user._id ,username:user.username,userLiked:onlineUsers.filter( onlineUser => onlineUser.userID === post.userID)[0] }) 
            } 
            setCommentText('');

        }
        
    }
    console.log('posts',postsList)
    return(
        <div className="homePosts" style={{overflowY:'scroll', overflowStyle: 'none', scrollbarWidth:'none'}}> 
        {postsList && !loading && userList.length !== 0 ? postsList.map((post,index)=>{  
                             
            const postUser = userList.filter(user=>user.data._id === post.userID)[0]
            const vid = post.media[0].mimetype.indexOf('video')
            
            return <div className="postWidget" style={{marginTop:'20px'}}>
            <div className="postWidgetUserSection" style={{display:'flex',height:'fit-content',padding:'5px 0px 5px 15px',alignItems:'center'}}> 
                 {postUser.data.photo ? <img src={postUser.data.photo} alt='profile' style={{width:'40px' ,height:'40px',borderRadius:'50%'}}/>:<div style={{width:'40px' ,height:'40px',borderRadius:'50%',backgroundColor:'grey'}}></div>}
                <Link className="Link" to='/profile' state={post.userID}><p style={{marginLeft:'10px'}}>{post.userUsername}</p></Link>
            </div> 
            <div className="postWidgetImageSection" style={{paddingBottom:'10px'}}> 
                {vid !== 0?<img src={`http://localhost:3001/${post.media[0].filename}`} alt={post.media[0].filename}></img>:<video controls  ><source src={`http://localhost:3001/${post.media[0].filename}`}type='video/mp4'/></video>}
                <div style={{height:'fit-content',margin:'5px 0px'}}>
                    {post.caption &&<p style={{margin:'0px'}}>Caption : {post.caption}</p>}
                </div>

                <div>
                    <button style={{backgroundColor:'transparent', border:'none'}} onClick={()=>handleLikeButtonClick(post,index)}><i style={ post.likes.includes(user._id)?{color:'red'}:{color:'initial'}} className="fa-solid fa-heart"></i></button>
                    <button  style={{backgroundColor:'transparent',border:'none'}} onClick={()=>setCommentButton(!commentButton)}><i className="fa-regular fa-comment"></i></button>
                </div>
            </div> 
            <div className="postWidgetCommentSection" style={commentButton?{padding:'5px 10px 15px 10px'}:{display:'none'}}> 
                <div style={{display:'flex'}}>
                    {user.photo ?<img src={user.photo} style={{width:'30px', height:'30px', borderRadius:'50%'}}/>:<div style={{width:'30px', height:'30px', borderRadius:'50%',backgroundColor:'grey'}}></div>}
                    <input type='text' onChange={(e)=>setCommentText(e.target.value)} name='comment' value={commentText} placeholder="Add comment ...." style={{marginLeft:'10px',width:'80%',backgroundColor:'transparent',borderBottom:'grey'}}/> 
                    <button onClick={()=>handleSubmitComment(post)}>Submit</button>
                </div>
                
            </div>
        </div>
        }): <div style={{height:'inherit',display:'flex',justifyContent:'center',position:'relative'}}>
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
    )
} 
export default HomePosts;