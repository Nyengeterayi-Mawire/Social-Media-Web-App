 import Navbar from "../components/navbar"; 
 import UploadMedia from "../components/uploadMedia";
 import { useSelector } from "react-redux";
const AddPost = () => {
    const user = useSelector(state=>state.user.value.user);
    return (
        <div className="addPost" style={{width:'70%',margin:'auto auto',borderRight:'1px solid grey',borderLeft:'1px solid grey'}}> 
            <Navbar user={user}/> 
            <UploadMedia/>
           
        </div>
    )
} 
export default AddPost;