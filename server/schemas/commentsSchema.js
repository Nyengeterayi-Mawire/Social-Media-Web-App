const mongoose = require('mongoose'); 

const schema = mongoose.Schema 

const commentsSchema = new schema({
    postID :{
        type: schema.Types.ObjectId,
        ref: 'posts'
    },
    userID : {
        type: schema.Types.ObjectId,
        ref: 'users'
    }, 
    text : String, 

},{timestamps:true}) 

module.exports = mongoose.model('comments',commentsSchema);