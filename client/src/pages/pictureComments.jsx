 import Navbar from '../components/navbar'; 
 import Singlepicture from '../components/singlePicture'; 
 import Comments from '../components/comments';
import { useLocation } from 'react-router-dom';
 const Picturecomments = () => {
    const location = useLocation()
    const {user,post} = location.state 
    
    return(
        <div className="pictureComments" style={{width:'70%',margin:'auto auto',borderRight:'1px solid rgb(58,59,60)',borderLeft:'1px solid rgb(58,59,60)'}} >  
            <Navbar user={user}/> 
            <Singlepicture post={post} />
        </div>
    )
}
export default Picturecomments;