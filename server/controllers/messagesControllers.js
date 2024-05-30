const Message = require('../schemas/messageSchema'); 
const Conversation = require('../schemas/conversation');
const User = require('../schemas/userSchema');



const sendMessage = async(req,res) => {
    try{ 
        const {senderID,receiverID,messageText,date,time} = req.body; 
        const {id} = req.params;  
        console.log(typeof(id))
        if(id==='0'){
            const createdConversation = await Conversation.create({firstuser:senderID,seconduser:receiverID}); 
            if (!createdConversation){
                return res.json({err: ' Failed to create conversation'})
            } 
            const message = await Message.create({conversationID:createdConversation._id,senderID,receiverID,message:messageText,date,time}) 
            const sender = await User.findById(senderID);
            if(!sender){
                res.json({err:'could not find user'})
            }
            const checkSenderMessagingList = sender.messaging.filter(id=>id === receiverID) 
            if (!checkSenderMessagingList) {
                const senderAddMessagingList = await User.findByIdAndUpdate(senderID,{$push:{messaging:receiverID}})
                // return res.json(senderAddMessagingList)
            } 

            const receiver = await User.findById(receiverID)
            if(!receiver){
                res.json({err:'could not find user'})
            }
            const checkReceiverMessagingList = receiver.messaging.filter(id=>id === senderID)[0] 
            console.log('333',checkSenderMessagingList)
            if (!checkReceiverMessagingList) {
                const receiverAddMessagingList = await User.findByIdAndUpdate(receiverID,{$push:{messaging:senderID}}) 
                console.log('444',receiverAddMessagingList)
                // return res.json(receiverAddMessagingList)
            } 
            return res.status(200).json(message);
        }
        const conversation  = await Conversation.findById(id);
        console.log('id',conversation) 
        if(!conversation){
            const createdConversation = await Conversation.create({firstuser:senderID,seconduser:receiverID}); 
            if (!createdConversation){
                return res.json({err: ' Failed to create conversation'})
            } 
            const message = await Message.create({conversationID:createdConversation._id,senderID,receiverID,message:messageText,date,time}) 
            console.log('3',message)
            return res.status(200).json(message);
        } 
        const message = await Message.create({conversationID:conversation._id,senderID,receiverID,message:messageText,date,time}) 
        console.log('created message',message)
        const sender = await User.findById(senderID);
        if(!sender){
            res.json({err:'could not find user'})
        }
        const checkSenderMessagingList = sender.messaging.filter(id=>id === receiverID) 
        if (!checkSenderMessagingList) {
            const senderAddMessagingList = await User.findByIdAndUpdate(senderID,{$push:{messaging:receiverID}})
            return res.json(senderAddMessagingList)
        } 

        const receiver = await User.findById(receiverID)
        if(!receiver){
            res.json({err:'could not find user'})
        }
        const checkReceiverMessagingList = receiver.messaging.filter(id=>id === senderID) 
        console.log('111',checkSenderMessagingList)
        if (!checkReceiverMessagingList) {
            const receiverAddMessagingList = await User.findByIdAndUpdate(receiverID,{$push:{messaging:senderID}}) 
            console.log('222',receiverAddMessagingList)
            return res.json(receiverAddMessagingList)
        } 

        return res.status(200).json(message);
    }catch(err){
        res.json({err: err.message})
    }
}

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

const findConversation = async(req,res) => {
    try{
        const {userLoggedIn,contactToMessage} = req.body;  
        console.log('userlogged in',userLoggedIn,'- contact',contactToMessage) 
        // const consversationList = Conversation.find({}); 
        // if(!consversationList) {
        //     return res.json({mssg : 'There are no conversations in database'})
        // }
        const conversationFirstUser = await Conversation.find({firstuser:userLoggedIn});
        console.log('000',conversationFirstUser) 
        if (conversationFirstUser.length === 0){
            console.log('entered first loop')
            const conversationSecondUser = await Conversation.find({seconduser:userLoggedIn});
            
            if (conversationSecondUser.length === 0){
                console.log('entered second loop')
                return res.json({})             
            }  
            console.log('converstaion list second',conversationSecondUser)
            const checkContactToMessage = conversationSecondUser.filter(conversation=>conversation.firstuser === contactToMessage)
            return res.status(200).json(checkContactToMessage[0])
            
        } 
        // console.log('converstaion list first',conversationFirstUSer) 
        const conversationWithContact = conversationFirstUser.filter(conversation=>conversation.seconduser === contactToMessage)
        console.log('converstaion with contact',conversationWithContact)  
        if(conversationWithContact.length === 0){
            return res.json({})
        }

        res.status(200).json(conversationWithContact[0])
    }catch(err){
        res.json({err:err.message})
    }
} 

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