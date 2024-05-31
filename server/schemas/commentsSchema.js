const mongoose = require('mongoose'); 

const schema = mongoose.Schema 

const commentsSchema = new schema({
    postID : String,
    userID : String, 
    text : String, 

},{timestamps:true}) 

module.exports = mongoose.model('comments',commentsSchema);