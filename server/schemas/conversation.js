const mongoose = require('mongoose'); 

const schema = mongoose.Schema; 

const conversationSchema = new schema({
    firstuser:String,
    seconduser:String

},{timestamps:true});

module.exports = mongoose.model('conversations',conversationSchema); 