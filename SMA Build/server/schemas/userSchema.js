const mongoose = require('mongoose');  

const schema = mongoose.Schema;

const userSchema = new schema({
    firstname:{
        type : String ,
        required : true
    }, 
    lastname:{
        type : String ,
        required : true
    },
    username:{
        type : String ,
        required : true
    }, 
    password:{
        type : String ,
        required : true
    },     
    email:{
        type: String
    },
    photo:String,
    following:[],  
    friends:[], 
    followers:[],
    messaging:[]
    }


) 

module.exports = mongoose.model('users',userSchema); 
