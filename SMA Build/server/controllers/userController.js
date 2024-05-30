const User = require('../schemas/userSchema'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken'); 
// const {body} = require('express-validator');


const createUser = async(req,res) => { 
    try{ 
        const {firstname,lastname,username,password,email,photo} = req.body; 
        console.log(req.body); 
        const userExist = await User.findOne({username}); 
        if (userExist) {
            return res.json({err : 'username taken',userExist})
        } 
        const hashed = await bcrypt.hash(password,10);
        
        console.log(hashed)
        if(!hashed){
            return res.json('Failed to encrypt password')
        } 
        const user = await User.create({firstname,lastname,username,password:hashed,email,photo})
        if(!user){
            return res.json('Failed to create user')
        } ; 
        res.status(200).json(user);
    }catch(err){
        res.json({err: err.message})
    }
   
    // res.json('create a User')

} 

const getUser = async(req,res)=> { 
    try{
        const {id} = req.params; 
        const user = await User.findById(id); 
        if(!user) {
            return res.status(401).json('could not find user')
        } 
        res.status(200).json(user);
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    
} 

const getAllUsers = async(req,res) => {
    try{
        const users = await User.find({}); 
        if(!users){
            return res.status(401).json('There are no users ');
        } 
        res.status(200).json(users);
    }catch(err){
        res.status(401).json({mssg:err.message})
    }   
}


const login = async(req,res)=> { 
    try{
        const data = req.body; 
        const user = await User.findOne({username:data.username}) 
        if(!user){
            return res.status(404).json({err :'Incorrect username'})
        } ; 
        const check = await bcrypt.compare(data.password,user.password); 
        if(!check){
            return res.status(404).json({err:'Incorrect password'})
        } 
        const token = jwt.sign({userID : user._id},process.env.SECRET,{expiresIn : '1h'}); 
        console.log('token is',jwt); 
        console.log('login',user)
        res.status(200).json({user, token });
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    // res.json('get a User')
} 

const updateUser = (req,res) => { 
    res.json('update a User')
}  

const addFollower = async(req,res) => { 
    try{
        const {id} = req.params; 
        const {followerID} = req.body; 
        console.log(id,req.body);
        const userFollowing = await User.findByIdAndUpdate({_id:id},{$push:{following:followerID}}); 
        if(!userFollowing) {
            return res.json('failed to add following user to following field'); 
        }  
        const userFollowed = await User.findByIdAndUpdate({_id:followerID},{$push:{followers:id}})
        if(!userFollowed) {
            return res.json('failed to add follower to  followers field'); 
        } 
        res.status(200).json()
    }catch(err){
        res.json({mssg:err.message})
    }
    
} 

const removeFollower = async(req,res) => {
    try{
        const {id} = req.params; 
        const {followerID} = req.body; 
        const userUnFollowing = await User.findByIdAndUpdate({_id:id},{$pull:{following:followerID}}); 
        if(!userUnFollowing) {
            return res.status(401).json('failed to remove user from my  following field'); 
        } 
        const userUnFollowed = await User.findByIdAndUpdate({_id:followerID},{$pull:{followers:id}});
        if(!userUnFollowed) {
            return res.status(401).json('failed to remove myself from user following field'); 
        } 
        res.status(200).json({userUnFollowed,userUnFollowing})
    }catch(err){
        res.status(500).json({mssg:err.message})
    }
} 

const addProfile = async(req,res)=> {
    try{
        const {id} = req.params; 
        const url = `http://localhost:3001/${req.file.filename}`;  
        console.log('url = ', url); 
        console.log(req.file);
        const user = await User.findByIdAndUpdate(id,{photo:url}); 
        if(!user){
            return res.status(401).json('Failed to add profile photo')
        }
        res.status(200).json('profile updated successfully');
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
} 

const settings = async(req,res) => {
    const fetched = req.body; 
    const file = req.file;  
    const {id} = req.params; 
      
    console.log('fetched',fetched,'--file',file)
    
    if(!fetched && !file){
        return res.staus(401).json('There is no data sent to update ')
    } 
    if(fetched.username){
        const userExist = await User.findOne({username : fetched.username}) 
        if(userExist){
            return res.json({err : 'username taken'})
        }
    }
    if(file){ 
        const url =  `http://localhost:3001/${req.file.filename}`;
        if('password' in fetched){
            const hash = await bcrypt.hash(fetched.password,10)
            const data = {...fetched,password:hash,photo : url};
            const user=await User.findByIdAndUpdate(id,data); 
            return res.status(200).json(user)
        }
        const data = {...fetched,photo : url};
        const user1=await User.findByIdAndUpdate(id,data); 
        return res.status(200).json(user1)
    }  
    if('password' in fetched){
        const hash = await bcrypt.hash(fetched.password,10)
        const data = {...fetched,password:hash};
        const user=await User.findByIdAndUpdate(id,data); 
        return res.status(200).json(user)
    }
    const user2 = await User.findByIdAndUpdate(id,fetched); 
    res.status(200).json(user2)
    


    
    
    // console.log(data,file,req.params.id)
} 

const addMessageContact = async(req,res) => {
    const {id} = req.params 
    const {contact} = req.body 

    const addedContact = await User.findByIdAndUpdate(id,{$push:{messaging:contact}}) 
    if(!addedContact){
        return res.json('could not add contact')
    } 
    res.status(200).json(addedContact)
}

module.exports = {createUser,getUser,updateUser,addFollower,removeFollower,addProfile,login,getAllUsers,settings,addMessageContact};