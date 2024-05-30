const express = require('express'); 
const router = express.Router();  
const {auth,tokenVerify} = require('../middleware/auth.js'); 
const multer = require('multer'); 
const path = require('path');
const {deletePost,createPost,updatePostcomment,updatePostlikes,deletePostcomment,deletePostlike,getSinglepost,uploadMedia,getMedia,userPostList} = require('../controllers/postsControllers.js');

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'upload/')
    } ,
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate unique file name
    }
}); 

const upload = multer({storage:storage});

router.get('/:id',tokenVerify,auth,getSinglepost)
router.delete('/:id',tokenVerify,auth,deletePost);
router.post('/',auth,upload.single('photo'),createPost); 
router.patch('/addComment/:id',tokenVerify,auth,updatePostcomment); 
router.patch('/addLike/:id',tokenVerify,auth,updatePostlikes); 
router.patch('/removeLike/:id',tokenVerify,auth,deletePostlike); 
router.patch('/removeComment/:id',tokenVerify,auth,deletePostcomment); 
router.patch('/uploadMedia/:id',auth,upload.single('photo'),uploadMedia), 
router.get('/',tokenVerify,auth,getMedia) ; 
router.get('/userPostList/:id',tokenVerify,auth,userPostList);
 


module.exports = router;