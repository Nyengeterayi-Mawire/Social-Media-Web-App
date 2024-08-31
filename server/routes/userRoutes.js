const express = require('express'); 
const router = express.Router();  
const { getUser, createUser, updateUser,addFollower,removeFollower,addProfile,login,getAllUsers,settings,addMessageContact} = require('../controllers/userController.js');
const {auth,tokenVerify} = require('../middleware/auth.js'); 
const multer = require('multer');
const path = require('path'); 
const validator = require('express-validator');
const {body} = require('express-validator');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload/');
    }, 
    filename:(req,file,cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage});

router.post('/login',auth,login); 
router.get('/:id',tokenVerify,auth,getUser);  
router.get('/',tokenVerify,auth,getAllUsers);
router.post('/',auth,createUser); 
router.patch('/add/:id',tokenVerify,auth,addFollower); 
router.patch('/remove/:id',tokenVerify,auth,removeFollower);
router.patch('/addcontact/:id',tokenVerify,auth,addMessageContact);
router.patch('/addprofile/:id',tokenVerify,upload.single('photo'),auth,addProfile);
router.patch('/settings/:id',upload.single('photo'),auth,settings);

module.exports = router;