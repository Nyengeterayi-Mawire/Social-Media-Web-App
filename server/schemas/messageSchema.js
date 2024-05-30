const mongoose = require('mongoose');
const conversation = require('./conversation');

const schema = mongoose.Schema; 

const messagesSchema = new schema({
    conversationID : String,  
    senderID : String,
    receiverID : String,
    message : String, 
    time: String, 
    date: String,

},{timestamps:true}); 

module.exports = mongoose.model('messages',messagesSchema);