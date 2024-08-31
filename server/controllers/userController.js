const User = require('../schemas/userSchema'); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken'); 

//Create a new user account. Used in signup
const createUser = async(req,res) => { 
    try{ 
        const {firstname,lastname,username,password,email,photo} = req.body; 
        //Check if username already exists
        const userExist = await User.findOne({username}); 
        if (userExist) {
            return res.json({err : 'username taken',userExist})
        } 
        //hash given password
        const hashed = await bcrypt.hash(password,10);
        if(!hashed){
            return res.json('Failed to encrypt password')
        } 
        //create user
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

//Get a single user account. Used in  navbar 
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

//Get all users. Used in search functionality in topnavbar
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

//Login to account
const login = async(req,res)=> { 
    try{
        const data = req.body; 
        //find user by username
        const user = await User.findOne({username:data.username}) 
        if(!user){
            return res.status(404).json({err :'Incorrect username'})
        } ; 
        //compare passwords
        const check = await bcrypt.compare(data.password,user.password); 
        if(!check){
            return res.status(404).json({err:'Incorrect password'})
        }           
        //create token
        const token = jwt.sign({userID : user._id},process.env.SECRET,{expiresIn : '1h'}); 
        res.status(200).json({user, token });
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
} 

const updateUser = (req,res) => { 
    res.json('update a User')
}  

//Follow a user
const addFollower = async(req,res) => { 
    try{
        const {id} = req.params; 
        const {followerID} = req.body; 
        //find current user and push id of user to follow to following array
        const userFollowing = await User.findByIdAndUpdate({_id:id},{$push:{following:followerID}}); 
        if(!userFollowing) {
            return res.json({err:'failed to add following user to following field'}); 
        }  
        //find followed user and push current users id to following array
        const userFollowed = await User.findByIdAndUpdate({_id:followerID},{$push:{followers:id}})
        if(!userFollowed) {
            return res.json('failed to add follower to  followers field'); 
        } 
        res.status(200).json()
    }catch(err){
        res.json({mssg:err.message})
    }
    
} 

//Unfollow a user
const removeFollower = async(req,res) => {
    try{
        const {id} = req.params; 
        const {followerID} = req.body;
        //Find current user and pull id of user to unfollow from following array 
        const userUnFollowing = await User.findByIdAndUpdate({_id:id},{$pull:{following:followerID}}); 
        if(!userUnFollowing) {
            return res.status(401).json('failed to remove user from my  following field'); 
        } 
        //Find unfollowed user and pull current users id from following array 

        const userUnFollowed = await User.findByIdAndUpdate({_id:followerID},{$pull:{followers:id}});
        if(!userUnFollowed) {
            return res.status(401).json('failed to remove myself from user following field'); 
        } 
        res.status(200).json({userUnFollowed,userUnFollowing})
    }catch(err){
        res.status(500).json({mssg:err.message})
    }
} 

//Update profile photo
const addProfile = async(req,res)=> {
    try{
        const {id} = req.params; 
        const url = `http://localhost:3001/${req.file.filename}`;  
        const user = await User.findByIdAndUpdate(id,{photo:url}); 
        if(!user){
            return res.status(401).json('Failed to add profile photo')
        }
        res.status(200).json('profile updated successfully');
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
} 

//Update users account information
const settings = async(req,res) => {
    const fetched = req.body; 
    const file = req.file;  
    const {id} = req.params;       
    
    //Check if there is any data sent to update
    if(!fetched && !file){
        return res.staus(401).json('There is no data sent to update ')
    } 
    //Update username and check if username does not already exist
    if(fetched.username){
        const userExist = await User.findOne({username : fetched.username}) 
        if(userExist){
            return res.json({err : 'username taken'})
        }
    }
    //Update user profile picture and password
    if(file){ 
        const url =  `http://localhost:3001/${req.file.filename}`;
        //Update password and hash it
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

    //Update password and hash it 
    if('password' in fetched){
        const hash = await bcrypt.hash(fetched.password,10)
        const data = {...fetched,password:hash};
        const user=await User.findByIdAndUpdate(id,data); 
        return res.status(200).json(user)
    }
    const user = await User.findByIdAndUpdate(id,fetched); 
    if(!user){
        return res.json({err:'Failed to update profile'});
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
} 

//Add contact
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