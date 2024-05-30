const jwt = require('jsonwebtoken');  
const multer = require('multer')
// const bcrypt = require('bcrypt'); 
const auth = async(req,res,next) => {
    console.log(req.path,req.method);  
  
    next();
}   

const tokenVerify = (req,res,next)=>{
    const token = req.header('Authorization'); 
    if(!token){
        return res.json({err : 'no token was passed'})
    } 
    
    const verify = jwt.verify(token,process.env.SECRET); 
    // console.log(verify)
    if(!verify){
        return res.json({err : 'Token is not valid'})
    } 
    
    next()
}

const media = (req,res,next) => { 
    const storage = multer.diskStorage({
        destination : (req,file,cb)=>{
            cb(null,'upload/')
        } ,
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate unique file name
        }
    }); 

    const upload = multer({storage:storage});
}



module.exports = {auth, tokenVerify};