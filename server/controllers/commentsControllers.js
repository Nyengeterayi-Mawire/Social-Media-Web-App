const Comment = require('../schemas/commentsSchema'); 
const Post = require('../schemas/postsSchema'); 

const addComment = async(req,res) => { 
    try{
        const {id} = req.params 
        const data = req.body 
        const comment = await Comment.create(data); 
        if(!comment){
            res.json({err:'failed to create comment'})
        } 
        const post = await Post.findByIdAndUpdate(id,{$push:{comments:comment._id}});
        if(!post){
            res.json({err: 'could not find post and add comment'})
        }  
        res.json(post)
        
    }catch(err){
        res.json({err : err.message})
    }
    
}  

const getAllComments = async(req,res) => { 
    try{ 
        const {id} = req.params;
        const comments = await Comment.find({postID:id}); 
        if(!comments){
            res.json({err:'there are no comments'})
        }
        res.status(200).json(comments);
    }catch(err){
        res.json({err: err.message})
    }
}  

const deleteComment = async(req,res) => { 
    try{
        const {id} = req.params; 
        console.log('commentId',id) 
        const {postID} = req.body
        const comment = await Comment.findByIdAndDelete(id); 
        // if(!comment) {
        //     return res.json({err: 'failed to delete'}); 
        // }
        const post = await Post.findByIdAndUpdate(postID,{$pull:{comments:comment._id}}) 
        // if(!post){
        //     return res.json({err:'could not delete comment'})
        // } 
        return res.status(200).json(post)
    }catch(err){
        return res.json({err:err.message})
    }
}



module.exports = {addComment,getAllComments,deleteComment} 