const Comment=require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer');
const Like = require('../models/like');


module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
        console.log('Created Comment:', comment);

        comment = await comment.populate('user', 'name email');
        commentMailer.newComment(comment);

           
        post.comments.push(comment);
        
            await post.save();
            console.log('Comment is added');
            res.redirect('/');
        }
    } catch (err) {
        // Handle error
        console.error(err);
        res.redirect('/');
    }
}

module.exports.destroy = async function(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            const post = await Post.findById(comment.post);

            // Delete the comment
            await comment.deleteOne();

            // Remove the comment from the post's comments array
            await Post.findByIdAndUpdate(post._id, { $pull: { comments: req.params.id } });

            //destroy the associated likes for the comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error:', err);
        return res.redirect('back');
    }
};
