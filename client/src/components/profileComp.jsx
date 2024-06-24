
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileComp = ({user,postList}) => { 
    

    
    useEffect(()=>{
         

    },[]) 
    // console.log('this is the post list',postList)
    return(
        <div className="profileInnerComponent" style={{width:'73%',fontSize:'0px'}}>  
            <div style={{width:'98%',height:'fit-content',maxHeight:'100%',padding:'10px 0px 20px 10px',display:'flex',flexWrap:'wrap',overflow:'scroll',scrollbarWidth:'none'}}>
                
                    {postList ? postList.map((post,index)=>{
                        const type = post.media[0].mimetype.includes('video') 
                        
                        return <Link style={{margin:'10px 10px 10px 10px'}} to='/picture' state={{user,post}} >
                                {!type ?<img className="mediaHover" src={`http://localhost:3001/${post.media[0].filename}`} style={{width:'200px',height:'250px',objectFit:'cover',borderRadius:'10px'}}/>:<video style={{width:'200px',height:'250px',objectFit:'cover',borderRadius:'10px'}}><source src={`http://localhost:3001/${post.media[0].filename}`}/></video>}
                            </Link>
                        
                    }):<h2>User has no pictures uploaded</h2>}
               
            </div>   
                      
            
        </div>
    )
} 
export default ProfileComp;