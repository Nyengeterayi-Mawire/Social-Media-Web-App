import { createSlice } from "@reduxjs/toolkit"; 
const initialState = {value : {messages : [],online : []}}
// {message:'How are you doing',date:'10 Jan 2024',time:'11:25',userName:'3',userPhoto:''},{message:'Im doing well and yourself',date:'10 Jan 2024',time:'12:15',userName:'4',userPhoto:''}]
export const messageSlice = createSlice({
    name : 'messages', 
    initialState, 
    reducers : {
        setMessageList : (state,action)=> {
            state.value.messages = action.payload;
        } ,

        addMessage : (state,action)=> {
            state.value.messages = [...state.value.messages,action.payload]
            // console.log(action.payload)
        } ,

        deleteMessage : (state,action) => {
            state.value = state.value.filter(((message,index)=>{
                return index !== action.payload
            }));
        }, 

        setOnline : (state,action) => {
            state.value.online = action.payload
        },  

        addOnline : (state,action) => {
            state.value.online = [...state.value.online,action.payload]
        } ,
        removeOnline : (state,action) => {
            state.value.online = state.value.online.filter(onlineUser=>onlineUser.userID !== action.payload)
        }


    }
}); 

export const {setMessageList,addMessage,deleteMessage,setOnline,addOnline,removeOnline} = messageSlice.actions; 
export default messageSlice.reducer;