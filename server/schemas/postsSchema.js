const mongoose = require('mongoose'); 

const schema = mongoose.Schema;

const postSchema = new schema({
    userID : {
        type: schema.Types.ObjectId,
        ref: 'users'
    },  
    userProfile : String, 
    userUsername : String,
    caption : String, 
    media : [], 
    likes : [], 
    comments : [], 
    date : String
}); 

module.exports = mongoose.model('posts',postSchema);