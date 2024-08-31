const express = require('express'); 
const router = express.Router();  
const {sendMessage,deleteMessage,findConversation,getMessages} = require('../controllers/messagesControllers'); 
const {auth,tokenVerify} = require('../middleware/auth');



router.post('/sendmessage/:id',tokenVerify,auth,sendMessage); 
router.post('/deletemessage',tokenVerify,auth,deleteMessage);  
router.post('/conversation/:id',tokenVerify,auth,findConversation);
router.get('/:id',tokenVerify,auth,getMessages);

module.exports = router;

