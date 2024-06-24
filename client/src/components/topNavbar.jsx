import { useSelector } from "react-redux"; 
import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useDispatch } from "react-redux"; 
import { setSearchShow } from "../features/navbarSlice";  
import { logout, setSearchList } from "../features/userSlice"; 
import { hide } from "../features/navbarSlice"; 

import axios from 'axios';
import { Socket } from "socket.io-client";
const TopNavbar = ({socket}) => { 
    const logged = useSelector(state=>state.navbar.value.leftNavbar) ;
    const display = useSelector(state=>state.navbar.value.search); 
    const searchList = useSelector(state=> state.user.value.searchList);
    const token = useSelector(state=>state.user.value.token); 
    const user = useSelector(state=>state.user.value.user)
    const [showSearchBar,setShowSearchBar] = useState(false);  
    const [displayValue,setDisplayValue] = useState(false); 
    const [searchValue,setSearchValue] = useState(''); 
    const [searchListDisplay,setSearchListDisplay] = useState([]);
    const navigate= useNavigate();  
    const dispatch = useDispatch();

    function searchShow(){ 
        
        setDisplayValue(!displayValue)
        dispatch(setSearchShow(displayValue));
        setShowSearchBar(!showSearchBar)
    }  

    function searchButtonClick(){
        axios.get('/register/',{headers:{'Authorization': token}}).then(res=>dispatch(setSearchList(res.data)))
    } 

    function searchInput(e){
        setSearchValue(e.target.value); 
        setSearchListDisplay(searchList.filter((user,index)=>{
            return user.username.includes( e.target.value) === true
        }))
    } 

    function closeSearchBar(){
        setDisplayValue(!displayValue); 
        dispatch(setSearchShow(displayValue));

    }
    // console.log(searchListDisplay);

    return( 
        <div className="TopNavbar" style={logged!==false?{display:'flex',flexDirection:'column',justifyContent:'center'}:{display:'none'}}>
            <div style={{width:'15em', position : 'absolute',top:'12px' }}>
                <div>
                <button onClick={searchShow}><i class="fa-solid fa-magnifying-glass"></i></button>
                <input className="inputButton" type='text' onClick={searchButtonClick} onChange={searchInput} placeholder="Search" style={display?{display:'initial',width:'12em',height:'25px',border:'1px solid grey',backgroundColor:'transparent',borderRadius:'20px',paddingLeft:'10px',color:'rgb(176,179,184)'}:{display:'none'}}></input> 
                </div>
                <div style={display?{height:'90vh',paddingTop:'15px',overflowY:'scroll',scrollbarWidth:'none'}:{display:'none'}}>

                    {searchListDisplay&&searchListDisplay.map((user)=>{
                        return <Link className="Link" to='/profile' state={user._id} onClick={closeSearchBar} ><div className=' searchUser' style={{display:'flex',margin:'10px 0px 0px 10px',border:'1px solid rgb(58,59,60)',padding:'5px', borderRadius:'25px'}}> 
                            {user.photo ? <img src={user.photo} style={{width:'50px',height:'50px',borderRadius:'50%',marginLeft:'5px'}}/>:<div style={{width:'50px',height:'50px',borderRadius:'50%',backgroundColor:'grey',marginLeft:'5px'}}/>}
                            <p style={{marginLeft:'10px'}}>{user.username}</p>
                        </div></Link>
                    })}

                </div>
            </div> 
            <div style={{width:'100%',display:'flex' }}>
                <div style={{margin:'auto '}}>
                
                <button onClick={()=>navigate('/home')} ><i className="fa-solid fa-house"></i></button> 
                <button onClick={()=>navigate('/home')}><i class="fa-solid fa-film"></i></button>
                <button><i class="fa-regular fa-bell"></i></button>
                <button onClick={()=>navigate('/messages')}><i class="fa-regular fa-message"></i></button>
                <button onClick={()=>navigate('/addpost')}><i class="fa-regular fa-square-plus"></i></button> 
                <button onClick={()=>navigate('/settings')}><i class="fa-solid fa-gear"></i></button> 

                </div> 
                <Link to='/profile' state={user._id} style={{marginLeft:'20px'}} ><i class="fa-solid fa-user"></i></Link>
                <button onClick={()=>{ 
                     dispatch(logout()); 
                     dispatch(hide())
                    navigate('/login');  
                    socket.disconnect();    
                    
                        
                         }}><i class="fa-solid fa-arrow-right-from-bracket"></i></button> 
            </div> 

        </div>
    )
} 
export default TopNavbar;