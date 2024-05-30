const mongoose = require('mongoose'); 

const schema = mongoose.Schema;

const postSchema = new schema({
    userID : String,  
    userProfile : String, 
    userUsername : String,
    caption : String, 
    media : [], 
    likes : [], 
    comments : [], 
    date : String
}); 

module.exports = mongoose.model('posts',postSchema);