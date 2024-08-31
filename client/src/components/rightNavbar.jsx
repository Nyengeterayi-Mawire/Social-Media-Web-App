import { useEffect,useState } from "react"
import { useSelector } from "react-redux" 
import { Link } from "react-router-dom"
import axios from "axios"
const RightNavbar = () => { 
    const logged = useSelector(state=>state.navbar.value) 
    const user = useSelector(state=>state.user.value.user)  
    const displayFollowers = useSelector(state => state.navbar.value.showFollowers); 
    const displayFollowing = useSelector(state => state.navbar.value.showFollowing); 
    const token = useSelector(state=>state.user.value.token)
    const [followingList,setFollowingList] = useState([]);
    const [followersList,setFollowersList] = useState([]); 

    useEffect(()=>{
        if(user.following){
            Promise.all(user.following.map(following=>axios.get('/register/'+following,{headers:{'Authorization': token}}))).then(res=>{
                setFollowingList(res);
            }) 
            
        }
        if(user.followers){
            Promise.all(user.followers.map(following=>axios.get('/register/'+following,{headers:{'Authorization': token}}))).then(res=>{
                setFollowersList(res);
            })
        }
    },[user])
    return(
        <div className="RightNavbar" style={logged!==false?{display:'flex',flexDirection:'column',width:'27%',padding:'0px 0px'}:{display:'none'}}>
            <div className="friendsWidget" style={{display:'none',margin:'20px auto',height:'fit-content', textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'85%'}}>
                <h3>FRIENDS</h3>
                {user.following && user.following.map((followed)=>{
                    return <Link to='/profile' className="Link" state={followed._id}><div style={{ display:'flex', margin:'10px 0px'}}> 
                        {followed.photo?<img alt='profile pic' src={followed.photo} style={{width:'50px',borderRadius:'50%',marginLeft:'10px'}}></img> : <div style={{width:'50px',borderRadius:'50%',marginLeft:'10px',backgroundColor:'grey'}}><i class="fa-solid fa-user" style={{margin:'auto auto'}}></i></div> }
                        <p style={{marginLeft:'10px'}}>{followed.username}</p> 
                    </div></Link>
                })}
            </div> 
            <div className="followersFollowingWidget" style={displayFollowing?{display:'initial',margin:'auto ',marginTop:'20px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{display:'none'}}>
                <h2>Following</h2>  
                {followingList && followingList.map(userIfollow=>{
                    return    <Link to='/profile' className="Link" state={userIfollow.data._id}> <div style={{ display:'flex', margin:'0px 0px',alignItems:'center'}}>
                                {userIfollow.data.photo?<img alt='profile pic' src={userIfollow.data.photo} style={{width:'40px',height:'40px',borderRadius:'50%',marginLeft:'10px'}}></img> : <div style={{width:'40px',height:'40px',borderRadius:'50%',marginLeft:'10px',backgroundColor:'grey'}}><i class="fa-solid fa-user" style={{margin:'auto auto'}}></i></div> }
                                <h3 style={{marginLeft:'10px'}}>{userIfollow.data.username}</h3>
                            </div></Link>                    
                })} 
            </div>
            <div className="followersFollowingWidget" style={ displayFollowers?{display:'initial',margin:'auto ',marginTop:'20px',marginBottom:'40px',textAlign:'center', backgroundColor:'rgb(58,59,60)',padding:'10px 0px 20px 0px',borderRadius:'20px',width:'12em'}:{display:'none'}}>
                <h2>Followers</h2>  
                {followersList && followersList.map(userIfollow=>{
                    return    <Link to='/profile' className="Link" state={userIfollow.data._id}> <div style={{ display:'flex', margin:'0px 0px',alignItems:'center'}}>
                                {userIfollow.data.photo?<img alt='profile pic' src={userIfollow.data.photo} style={{width:'40px',height:'40px',borderRadius:'50%',marginLeft:'10px'}}></img> : <div style={{width:'40px',height:'40px',borderRadius:'50%',marginLeft:'10px',backgroundColor:'grey'}}><i class="fa-solid fa-user" style={{margin:'auto auto'}}></i></div> }
                                <h3 style={{marginLeft:'10px'}}>{userIfollow.data.username}</h3>
                            </div></Link>                    
                })} 
            </div>
        </div>
    )
} 
export default RightNavbar;