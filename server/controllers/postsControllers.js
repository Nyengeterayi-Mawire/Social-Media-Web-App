const Posts = require('../schemas/postsSchema');  

//Get single post
const getSinglepost = async(req,res) => { 
    try{
        const {id} = req.params; 
        const post = await Posts.findById(id); 
        if(!id){
            return res.status(401).json('could not find post');
        } 
        res.status(200).json(post);
    }catch(err){
        res.status(500).json({mssg:err.message})
    }
}

//Create a post
const createPost = async(req,res) => {  
    try{ 
        const data = req.body;
        //Check to see if an image was uploaded
        if(!req.file){
            return res.status(401).json({err:'No image was uploaded'});
        }  
        const post = await Posts.create(data);  
        if(!post){
            return res.status(401).json({err:'failed to create post'});
        }   
        //Add image file to media field of the created post         
        const addMediatoPost = await Posts.findByIdAndUpdate(post._id,{$push:{media:req.file}});  
        if(!addMediatoPost){
            return res.status(200).json({err:'Failed to  save image to database'})
        } 
        //get updated post and send to client 
        const updatedPost = await Posts.findById(post._id) 
        if (!updatedPost){
            return res.status(200).json({err:'Could not find the post'})
        }
        
        res.status(200).json(updatedPost)
    }catch(err){ 
        res.status(401).json({mssg:err.message});
    }
    
} ; 

//Delete a post controller
const deletePost =async (req,res) => {  
    try{
        const {id} = req.params;  
        const post = await Posts.findByIdAndDelete(id); 
        if(!post){
            return res.json({err :'failed to delete post'})
        } 
        res.status(200).json(post);
    }catch(err){
        res.json({mssg:err.message});
    }
    
}; 

const updatePostcomment = async(req,res) => {  
    try{
        const {id} = req.params; 
        const data = req.body; 
        const post = await Posts.findByIdAndUpdate(id,{$push:{comments:data}}) 
        if(!post){ 
           return res.status(401).json('failed to update comment')
        } 
        res.status(200).json(post);
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    
};   

//Add a like to post 
const updatePostlikes = async(req,res) => {  
    try{
        const {id} = req.params; 
        const data = req.body; 
        //Find post
        const post = await Posts.findById(id)  
        if(!post){ 
           return res.json('Could not find post')
        }  
        //Check if user id is in likes array, if yes then pull id from array
        if(post.likes.includes(data._id)){
            const likePost = await Posts.findByIdAndUpdate(id,{$pull:{likes:data._id}}) 
            if (likePost){
                const updatedPost = await Posts.findById(id);
                return res.status(200).json(updatedPost);
            }
        }
        //if user id does not exist push/add user id to likes array
        const likePost = await Posts.findByIdAndUpdate(id,{$push:{likes:data._id}}) 
        if (likePost){
            const updatedPost = await Posts.findById(id);
            return res.status(200).json(updatedPost);
        }
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    
};   

//delete post comment controller
const deletePostcomment = async(req,res) => {  
    try{
        const {id} = req.params; 
        const data = req.body; 
        const post = await Posts.findByIdAndUpdate(id,{$pull:{comments:data}}) 
        if(!post){ 
           return res.status(401).json('failed to delete comment')
        } 
        res.status(200).json(post);
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    
};  

const deletePostlike = async(req,res) => {  
    try{
        const {id} = req.params; 
        const data = req.body; 
        const post = await Posts.findByIdAndUpdate(id,{$pull:{likes:data}}) 
        if(!post){ 
           return res.status(401).json('failed to update comment')
        } 
        res.status(200).json(post);
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    
};   

//
const uploadMedia = async(req,res) => {
    try{

        if(!req.file){
            return res.staus(401).json('No image was uploaded');
        } 
        const {id} = req.params;  
        console.log(req.file);
        const post = await Posts.findByIdAndUpdate(id,{$push:{media:req.file}}); 
        if(!post){
            return res.status(200).json('Failed to  save image to database')
        } 
        console.log(post);
        res.status(200).json("image uploaded successfully")
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
} 

//Get all posts
const getMedia = async(req,res) => {   
    try{        
        const post = await Posts.find({});
        if(!post){
            return res.status(401).json({err:'There are no posts'}); 
        } 
        res.status(200).json(post); 
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
} 

//Get all posts for a particular user. Used in the Profile page
const userPostList = async(req,res) => {
    try{
        const {id} = req.params; 
        const post = await Posts.find({userID:id}); 
        if(!post){
            return res.status(401).json('no posts were found');
        } 
        res.status(200).json(post);
    }catch(err){
        res.status(401).json({mssg:err.message})
    }
}



module.exports = {createPost,deletePost,updatePostcomment,updatePostlikes,deletePostcomment,deletePostlike,getSinglepost,uploadMedia,getMedia,userPostList};