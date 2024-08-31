const mongoose = require('mongoose');
const conversation = require('./conversation');

const schema = mongoose.Schema; 

const messagesSchema = new schema({
    conversationID : {
        type: schema.Types.ObjectId,
        ref: 'conversations'
    }, 
    senderID : {
        type: schema.Types.ObjectId,
        ref: 'users'
    },
    receiverID : {
        type: schema.Types.ObjectId,
        ref: 'users'
    },
    message : String, 
    time: String, 
    date: String,

},{timestamps:true}); 

module.exports = mongoose.model('messages',messagesSchema);