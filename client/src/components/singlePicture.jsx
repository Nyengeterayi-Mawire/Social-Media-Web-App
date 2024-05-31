import Comments from "./comments"; 
import { useNavigate } from "react-router-dom";  
import { useSelector } from "react-redux";
import { combineSlices } from "@reduxjs/toolkit";
import axios from "axios";
const Singlepicture = ({post}) => { 
    // console.log('picture to display',post)  
    const userLoggedIn = useSelector(state=>state.user.value.user) 
    const token = useSelector(state=>state.user.value.token)
    const navigate= useNavigate(); 
    console.log('user ----', post) 

    const deletePost = () => {
        axios.delete('/post/'+post._id, {headers : { 'Authorization' : token}}).then(res=>{
            if(res.data.err){
                console.log('coukd not delete post',res.data.err)
            }else{
                console.log('successfully deleted post')
            }
        })
    }
    return(
        <div className="singlePicture" style={{width:'73%',display:'flex',flexDirection:'row'}}>  
            
            <div style={{width:'65%',paddingTop:'20px'}}>
                <div style={{height:'80%',width:'85%',margin:'auto'}}>
                    <div  style={{height:'fit-content', width:'fit-content',display:'inline-flex', marginBottom:'10px'}}>
                        <button style={{width:'75px',height:'50px',borderRadius:'25px',}}onClick={()=>navigate(-1)}>Back</button> 
                        {/* <h3 >Back</h3> */}
                    </div>
                        {!post.media[0].mimetype.includes('video')?<img src={`http://localhost:3001/${post.media[0].filename}`} style={{width:'100%',height:'75%',objectFit:"fill"}}/> : <video controls autoPlay muted loop style={{width:'100%',height:'75%',objectFit:"fill"}}><source src={`http://localhost:3001/${post.media[0].filename}`} /></video> }
                        <div>
                            <button style={userLoggedIn._id === post.userID ? {display:'initial'}:{display:'none'}} onClick={deletePost}>Delete Post</button>
                        </div>
                </div>
            </div>
            <Comments postID={post._id} userID={userLoggedIn._id}/>
        </div>
    )
} 
export default Singlepicture;