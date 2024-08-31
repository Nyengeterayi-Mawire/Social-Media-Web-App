const Message = require('../schemas/messageSchema'); 
const Conversation = require('../schemas/conversation');
const User = require('../schemas/userSchema');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types

const sendMessage = async(req,res) => {
    try{ 
        const {senderID,receiverID,messageText,date,time} = req.body; 
        const {id} = req.params;  
        //No conversation exists 
        if(id==='0'){
            //create conversation
            const createdConversation = await Conversation.create({firstuser:senderID,seconduser:receiverID}); 
            if (!createdConversation){
                return res.json({err: ' Failed to create conversation'})
            } 
            //create message
            const message = await Message.create({conversationID:createdConversation._id,senderID,receiverID,message:messageText,date,time});
            if(!message){
                res.json({err:'could not create message'})
            } 
            //Find sender
            const sender = await User.findById(senderID);
            if(!sender){
                res.json({err:'could not find user'})
            }
            //Check if receiver already exists in senders contacts
            const checkSenderMessagingList = sender.messaging.filter(id=>id === receiverID) 
            if (!checkSenderMessagingList) {
                const senderAddMessagingList = await User.findByIdAndUpdate(senderID,{$push:{messaging:receiverID}})
            } 
            //Find receiver
            const receiver = await User.findById(receiverID)
            if(!receiver){
                res.json({err:'could not find user'})
            }
            //Check if sender already exists in receivers contacts
            const checkReceiverMessagingList = receiver.messaging.filter(id=>id === senderID)[0] 
            if (!checkReceiverMessagingList) {
                //Add sender to receivers contacts
                const receiverAddMessagingList = await User.findByIdAndUpdate(receiverID,{$push:{messaging:senderID}}) 
                console.log('444',receiverAddMessagingList)
                // return res.json(receiverAddMessagingList)
            } 
            return res.status(200).json(message);
        }
        //If there is a conversation that already exists
        const conversation  = await Conversation.findById(id);
        // if(!conversation){
        //     const createdConversation = await Conversation.create({firstuser:senderID,seconduser:receiverID}); 
        //     if (!createdConversation){
        //         return res.json({err: ' Failed to create conversation'})
        //     } 
        //     const message = await Message.create({conversationID:createdConversation._id,senderID,receiverID,message:messageText,date,time}) 
        //     console.log('3',message)
        //     return res.status(200).json(message);
        // } 

        //Create message and add to contacts
        const message = await Message.create({conversationID:conversation._id,senderID,receiverID,message:messageText,date,time}) 
        const sender = await User.findById(senderID);
        if(!sender){
            res.json({err:'could not find user'})
        }
        const checkSenderMessagingList = sender.messaging.filter(id=>id === receiverID) 
        if (!checkSenderMessagingList) {
            const senderAddMessagingList = await User.findByIdAndUpdate(senderID,{$push:{messaging:receiverID}})
            if(!senderAddMessagingList){
                return res.json({err:'could not add receiver to contacts'})
            }
            // return res.json(senderAddMessagingList)
        } 

        const receiver = await User.findById(receiverID)
        if(!receiver){
            return res.json({err:'could not find user'})
        }
        const checkReceiverMessagingList = receiver.messaging.filter(id=>id === senderID) 
        if (!checkReceiverMessagingList) {
            const receiverAddMessagingList = await User.findByIdAndUpdate(receiverID,{$push:{messaging:senderID}}) 
            if(!receiverAddMessagingList){
                return res.json({err:'could not add sender to contacts'})
            }
            // return res.json(receiverAddMessagingList)
        } 

        return res.status(200).json(message);
    }catch(err){
        res.json({err: err.message})
    }
}

//Deelete message controller
const deleteMessage = async(req,res) => {
    try{
        const {id} = req.params; 
        const message = await Message.findByIdAndDelete(id); 
        if (!message){
            return res.json({err:'Could not delete message'});
        } 
        res.satus(200).json(message)
    }catch(err){
        res.json({err: err.message})
    }
}  

//Find conversation controller
const findConversation = async(req,res) => {
    try{
        const {userLoggedIn,contactToMessage} = req.body;  
        //Check for current users conversations in firstuser field and filter results to search for conversation with 
        //contact in the seconduser field
        const conversationFirstUser = await Conversation.find({firstuser:userLoggedIn});
        const first = conversationFirstUser.filter(convo => convo.seconduser.equals(contactToMessage));
        if(first.length != 0){
            console.log('aaa',first);
           return res.status(200).json(first[0]);
        }       
        //Check for current users conversations in seconduser field and filter results to search for conversation with 
        //contact in the firstuse field
        const conversationSecondtUser = await Conversation.find({seconduser:userLoggedIn}); 
        const second = conversationSecondtUser.filter(convo => convo.firstuser.equals(contactToMessage));
        if(second.length === 0){
            //No conversation with both id as firstuser or seconduser
            return res.status(200).json({})
        }         
        res.status(200).json(second[0]);
        
    }catch(err){
        res.json({err:err.message})
    }
} 

//Get all messages for a singular conversation
const getMessages = async(req,res) => {
    try{
        const {id} = req.params; 
        if(id===''){
            return res.json([])
        } 
        const messages = await Message.find({conversationID:id}) 
        res.status(200).json(messages)
    }catch(err){
        res.json({err:err.message})
    }
}

module.exports = {sendMessage,deleteMessage,findConversation,getMessages};