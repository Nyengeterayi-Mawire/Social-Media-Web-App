import logo from './logo.svg';
import './App.css'; 
import {useState,useEffect, useDeferredValue} from 'react' 
import axios from 'axios'; 
import Register from './pages/register'; 
import Login from './pages/login'; 
import {BrowserRouter as Router,Route, Routes,Navigate} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Home from './pages/home'; 
import  Navbar  from './components/navbar'; 
import TopNavbar from './components/topNavbar';
import RightNavbar from './components/rightNavbar';
import AddPost from './pages/addPost'; 
import { useSelector,useDispatch } from 'react-redux';
import Profile from './pages/profile';
import MessageContacts from './pages/messageContacts';  
import {io} from 'socket.io-client'; 
import {Toaster} from 'react-hot-toast'; 
import toast from 'react-hot-toast'
import Settings from './pages/settings';
import Picturecomments from './pages/pictureComments'; 
import { addMessage, addOnline,removeOnline } from './features/meassages'; 
import { addComment,addPost,addContact } from './features/userSlice';

// const socket = io.connect('http://localhost:3001',{autoConnect : false});
// console.log(socket);

function App() {  
  const user = useSelector((state)=>state.user.value.logged) 
  const userLoggedIn = useSelector((state)=> state.user.value.user)
  const socket = useSelector((state)=>state.user.value.socket) 
  const navigate = useNavigate()
  
  const dispatch = useDispatch();
  console.log('logged',user);  


  // const [form,setForm] = useState({photo:''}) 
  // const [image,setImage] = useState(null); 
  // const id = '663243a5f6f407926bd63331'  

 useEffect(()=>{
    navigate('/login')
 },[])

  useEffect(()=>{
        if(socket){
          socket.on('newLogin',data=>{
            dispatch(addOnline(data))
          })  
          socket.on('logout',userID=>{
            console.log('user logged out',userID)
            dispatch(removeOnline(userID))
          })
          socket.on('likeNotification',data=>{
            toast.success(`${data.username} liked your photo`,{style:{
              backgroundColor:'rgb(58,59,60)',
              color:'#fff',             
            }})
          }) 
          socket.on('commentNotification',data=>{
            toast.success(`${data.username} commented on your photo`,{style:{
              backgroundColor:'rgb(58,59,60)',
              color:'#fff',             
            }})         
          });  
          // socket.on('addPost',data=>{
          //   dispatch(addPost(data))
          // })
          socket.on('sendMessage',data=>{ 
            if (userLoggedIn.messaging.filter(contactID => contactID === data.details.senderID).length === 0){
              console.log('I dont wnt this to run')
              dispatch(addContact(data.details.senderID))
            } 
            console.log('inside send message socket', userLoggedIn)
            toast(`New message from : ${data.details.userName}`,{style:{
              backgroundColor:'rgb(58,59,60)',
              color:'#fff',             
            }})
          })
        }
        
      },[socket]);  

  return (
    <div className="App">      
      <Toaster position='bottom-center'/>      
      <TopNavbar socket={socket}/>       
      <Routes>      
        <Route path='/login' element={!user?<Login socket={socket}/>:<Navigate to='/home'></Navigate>}></Route> 
        <Route path='/register' element={!user?<Register/>:<Navigate to='/home'/>}/>
        <Route path='/home' element={user?<Home/>:<Navigate to='/login'/>}/> 
        <Route path='/addpost' element={user?<AddPost/>:<Navigate to='/login'/>}/> 
        <Route path='/profile' element={user?<Profile/>:<Navigate to='/login'/>}/> 
        <Route path='/messages' element={user?<MessageContacts socket={socket}/>:<Navigate to='/login'/>}/> 
        <Route path='/settings' element={user?<Settings socket={socket}/>:<Navigate to='/login'/>}/> 
        <Route path='/picture' element={user?<Picturecomments socket={socket}/>:<Navigate to='/login'/>}/>         
      </Routes>     
    
    
    </div>
  );
}

export default App;
