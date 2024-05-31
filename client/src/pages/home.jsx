import Navbar from "../components/navbar"; 
import RightNavbar from "../components/rightNavbar"; 
import HomePosts from "../components/homePosts"; 
import axios from "axios"; 
import { useEffect } from "react"; 
import { useDispatch, useSelector} from "react-redux";  
import { setPosts } from "../features/userSlice"; 
import { setOnline } from "../features/meassages";

const Home = () => {  
    const dispatch = useDispatch(); 
    const postsList = useSelector(state=>state.user.value.posts); 
    const user = useSelector(state=>state.user.value.user); 
    const token = useSelector(state=>state.user.value.token);
    // console.log('This is the list', postsList);

    useEffect(()=>{
        // function get(){
        //     axios
        // } 
        axios.get('/post/',{headers : {
            'Authorization' : token,
        }}).then(res=>dispatch(setPosts(res.data))).catch(err=>console.log(err)); 

       

    
        axios.get('/socket').then(res=>dispatch(setOnline((res.data))))

    },[dispatch,user])
    return (  
        
        <div className="Home" style={{width:'70%',margin:'auto auto',borderRight:'1px solid grey',borderLeft:'1px solid grey'}} >  
            <Navbar user={user}/>
            <HomePosts user={user} postsList={postsList}/>
            <RightNavbar/>
        </div>
    )
} 
export default Home;