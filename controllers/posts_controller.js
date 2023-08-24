const Post = require('../models/post');
const User = require('../models/user'); 
const Comment = require('../models/comment'); 
const Like = require('../models/like'); 


module.exports.create = async function(req, res){
    try {
       // console.log('User ID:', req.user.id);
        let user = await User.findById(req.user.id);

        let post = await Post.create({
            content: req.body.content,
            user: req.user.id
        });

        console.log('Created post details:', post);
        req.flash('success', 'Post published');
          
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post,
                    username: user.name
                },
                message: "post created"
            });
        }

        if (!post) {
            console.log('Error in creating a post');
            return res.redirect('back');
        }

        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
        console.log('Error in creating a post:', err);
        return res.redirect('back');
    }
};

module.exports.destroy = async function(req, res){
    try {
        const post = await Post.findById(req.params.id);
        console.log('Fetched Post:', post);
        if (post.user == req.user.id) {

            //delete the associated likes for the post and all its comments likes too
            await Like.deleteMany({likeable: post, onModel:'Post'})
            await Like.deleteMany({_id: {$in: post.comments}})

            await post.deleteOne();;

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "post deleted"
                });
            }

            req.flash('success', 'Post Deleted');
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error:', err);
        return res.redirect('back');
    }
}


