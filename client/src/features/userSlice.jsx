import { createSlice } from "@reduxjs/toolkit";
import { act } from "react"; 
import { useState } from "react"; 
import { io } from "socket.io-client";

const initialState = {value:{user:{}, posts:[], token:'', logged:false, searchList:[], commentsList:[] ,socket:null}}
export const userSlice = createSlice({
    name : 'user', 
    initialState, 
    reducers : {
        setUser : (state,action)=>{
            state.value.user = action.payload;
        } ,

        setPosts : (state,action)=> {
            state.value.posts = action.payload;
        } ,

        setLogged : (state,action)=>{
            state.value.logged = true;
        },  

        logout : (state,action) => {
            state.value.logged = false;
        },

        setSearchList : (state,action)=> {
            state.value.searchList = action.payload
        } ,

        addFriend : (state,action) => { 
            state.value.user.following.push(action.payload)
        },  
        removeFriend : (state,action) => {
            state.value.user.following = state.value.user.following.filter((userFollowing)=>userFollowing !== action.payload)
        },

        addLike : (state,action) => { 
            if(state.value.posts[action.payload.index].likes.includes(action.payload.id)){
                state.value.posts[action.payload.index].likes = state.value.posts[action.payload.index].likes.filter((id)=>{
                return id !== action.payload.id
               })
            }else{
                state.value.posts[action.payload.index].likes = [...state.value.posts[action.payload.index].likes, action.payload.id] 
            }
        }, 

        setCommentsList : (state,action) => {
            state.value.commentsList = action.payload
        } ,

        addComment : (state,action) => {
            state.value.commentsList = [...state.value.commentsList,action.payload]
        },

        changeSettings: (state,action) => {
            if(action.payload.photo){
                const url = URL.createObjectURL(action.payload.photo); 
                state.value.user.photo = `${url}`
            }  
            if(action.payload.username){
                state.value.user.username = action.payload.username;
            }

        }, 
        setToken : (state,action) => {
            state.value.token = action.payload
        }, 
        setSocket : (state,action) => {
            state.value.socket = io.connect('http://localhost:3001/',{query:{userID : action.payload.userID,username :action.payload.username}})
        },
        addPost : (state,action) =>{
            state.value.posts = [action.payload,...state.value.posts]
        }, 
        addContact : (state,action) => {
            state.value.user.messaging = [action.payload,...state.value.user.messaging]
        }

    }
}) 

export const {setUser,setPosts,setLogged,setSearchList,addFriend,removeFriend,addLike,logout,changeSettings,setToken,setSocket,setCommentsList,addComment,addPost,addContact} = userSlice.actions; 

export default userSlice.reducer;