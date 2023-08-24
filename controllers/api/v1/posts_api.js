const Post= require('../../../models/post');
const Comment= require('../../../models/comment');


module.exports.index = async function(req, res){

const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate(
            { 
                path: 'comments',
                populate: {
                    path: 'user'
                }
            }).exec();


    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res){
    try {
        const post = await Post.findById(req.params.id);
        console.log('Fetched Post:', post);
    
        if(post.user == req.user.id){
            await post.deleteOne();;

            await Comment.deleteMany({ post: req.params.id });

           
            return res.json(200, {
                message: "Post and associated comments deleted successfully"
            });

        }else{
            return res.json(401, {
                message: "you cannot delete this post!"
            });
        }
       
    } catch (err) {
        
        return res.json(500, {
            message: "Internal server error"
        });
    }
}
