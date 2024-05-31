
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileComp = ({user,postList}) => { 
    

    
    useEffect(()=>{
         

    },[]) 
    // console.log('this is the post list',postList)
    return(
        <div className="profileInnerComponent" style={{width:'73%',fontSize:'0px'}}>  
            <div style={{width:'98%',height:'fit-content',maxHeight:'100%',padding:'10px 0px 20px 10px',display:'flex',flexWrap:'wrap',overflow:'scroll',scrollbarWidth:'none'}}>
                {/* <div className='profileInnerComponentNav'>
                    View options
                </div> */}
                
                    {postList ? postList.map((post,index)=>{
                        const type = post.media[0].mimetype.includes('video') 
                        console.log('tyyyypppeee',type)
                        return <Link style={{margin:'10px 10px 10px 10px'}} to='/picture' state={{user,post}} >
                                {!type ?<img src={`http://localhost:3001/${post.media[0].filename}`} style={{width:'200px',height:'250px',objectFit:'cover',borderRadius:'10px'}}/>:<video style={{width:'200px',height:'250px',objectFit:'cover',borderRadius:'10px'}}><source src={`http://localhost:3001/${post.media[0].filename}`}/></video>}
                            </Link>
                        
                    }):<h2>User has no pictures uploaded</h2>}
               
            </div> 
            {/* <div style={{width:'60%',height:'100%',border:'1px solid orange'}}>
                <div className='profileInnerComponentNav'>
                    View options
                </div>
                <div className="profileInnerComponentView">
                    Posts Section
                </div> 
            </div>  */}
            {/* <div className="commentSection" style={{width:'40%', heigth:'100%'}}>

            </div> */}
            
            
                {/* <img src={user.photo} alt='user-profile-image' style={{width:'100%',border:'1px solid red'}}/> */}
            
            
            
            
        </div>
    )
} 
export default ProfileComp;