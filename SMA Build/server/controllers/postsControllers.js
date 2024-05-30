const Posts = require('../schemas/postsSchema');  

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

const createPost = async(req,res) => {  
    try{ 
        const data = req.body
        // const {id} = req.params;  
        // console.log(data); 
        // console.log('data',data);
        if(!req.file){
            return res.status(401).json('No image was uploaded');
        }  
        const post = await Posts.create(data);  
        // console.log('returned post',post._id);
        if(!post){
            return res.status(401).json('failed to create post');
        }            
        const updatePost = await Posts.findByIdAndUpdate(post._id,{$push:{media:req.file}});  
        // console.log('returned updatePost',updatePost);
        if(!updatePost){
            return res.status(200).json('Failed to  save image to database')
        } 
        
        res.status(200).json("image uploaded successfully")
    }catch(err){ 
        res.status(401).json({mssg:err.message});
    }
    
} ; 

const deletePost =async (req,res) => {  
    try{
        const {id} = req.params;  
        console.log('id of post',id)
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

const updatePostlikes = async(req,res) => {  
    try{
        const {id} = req.params; 
        const data = req.body; 
        // console.log(data)
        const post = await Posts.findById(id)  
        console.log(post);
        
        if(!post){ 
           return res.json('Could not find post')
        }  
        if(post.likes.includes(data._id)){
            console.log('user wants to unlike liked') ; 
            const likePost = await Posts.findByIdAndUpdate(id,{$pull:{likes:data._id}}) 
            if (likePost){
                const updatedPost = await Posts.findById(id);
                return res.status(200).json(updatedPost);
            }
        }
        // console.log(post);
        console.log('user wants to like '); 
        const likePost = await Posts.findByIdAndUpdate(id,{$push:{likes:data._id}}) 
        if (likePost){
            const updatedPost = await Posts.findById(id);
            return res.status(200).json(updatedPost);
        }

        
        
        
        // res.status(200).json(post);
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
    
};   

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
// const updateMedia = async(req,res) => {
//     try{
        
//         if(!req.file){
//             return res.staus(401).json('No image was uploaded');
//         } 
//         const {id} = req.params;  
//         console.log(req.file);
//         const post = await Posts.findByIdAndUpdate(id,{$push:{media:req.file}}); 
//         if(!post){
//             return res.status(200).json('Failed to  save image to database')
//         } 
//         console.log(post);
//         res.status(200).json("image uploaded successfully")
//     }catch(err){
//         res.status(401).json({mssg:err.message});
//     }
// } 

const getMedia = async(req,res) => { 
    // const post = await Posts.find({});
    // console.log('fetxhed list',post) 
    try{
        
        const post = await Posts.find({});
        console.log('fetxhed list',post) 
        if(!post){
            return res.status(401).json('There are no posts'); 

        } 
        res.status(200).json(post); 
        // res.send('accepted')
    }catch(err){
        res.status(401).json({mssg:err.message});
    }
} 

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