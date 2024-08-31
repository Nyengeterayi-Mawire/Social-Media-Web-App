const express = require('express'); 
const router = express.Router(); 
const {addComment,getAllComments, deleteComment} = require('../controllers/commentsControllers'); 
const { auth ,tokenVerify} = require('../middleware/auth');

router.patch('/add/:id',tokenVerify,auth,addComment);  
router.get('/:id',tokenVerify,auth,getAllComments); 
router.delete('/delete/:id',tokenVerify,auth,deleteComment);

module.exports = router;