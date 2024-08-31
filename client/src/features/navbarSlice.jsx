import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {value:{leftNavbar:false, search:false , showFollowers:false, showFollowing:false}}

export const navbarSlice = createSlice({
    name : 'navbar', 
    initialState,
    reducers : {
        show:(state)=>{
            state.value.leftNavbar = true;
        } ,
        hide:(state)=>{
            state.value.leftNavbar=false;
        }, 
        setSearchShow:(state,action)=>{
            state.value.search = !state.value.search;
        } ,
        showFollowing:(state,action)=>{
            state.value.showFollowing = action.payload;
        },
        showFollowers:(state,action)=>{
            state.value.showFollowers = action.payload;
        }
    }
}); 

export const {show,hide,setSearchShow,showFollowers,showFollowing} = navbarSlice.actions; 

export default navbarSlice.reducer;