const mongoose = require('mongoose'); 

const schema = mongoose.Schema; 

const conversationSchema = new schema({
    firstuser:{
        type: schema.Types.ObjectId,
        ref: 'users'
    },
    seconduser:{
        type: schema.Types.ObjectId,
        ref: 'users'
    },

},{timestamps:true});

module.exports = mongoose.model('conversations',conversationSchema); 