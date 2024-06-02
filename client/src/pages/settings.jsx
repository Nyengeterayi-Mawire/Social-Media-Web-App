import SettingsComponent from "../components/settings"; 
import Navbar from "../components/navbar"; 
import { useSelector } from "react-redux";
const Settings = () => {  
    const user = useSelector(state=>state.user.value.user)
    return (
        <div className="settings" style={{width:'70%',margin:'auto auto',borderRight:'1px solid rgb(58,59,60)',borderLeft:'1px solid rgb(58,59,60)'}}>
            <Navbar user={user}/>
            <SettingsComponent user={user}/>
        </div>
    )
}
export default Settings;