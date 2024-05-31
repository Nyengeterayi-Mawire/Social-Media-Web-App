import SettingsComponent from "../components/settings"; 
import Navbar from "../components/navbar"; 
import { useSelector } from "react-redux";
const Settings = () => {  
    const user = useSelector(state=>state.user.value.user)
    return (
        <div className="settings" style={{width:'70%',margin:'auto auto',borderRight:'1px solid grey',borderLeft:'1px solid grey'}}>
            <Navbar user={user}/>
            <SettingsComponent user={user}/>
        </div>
    )
}
export default Settings;