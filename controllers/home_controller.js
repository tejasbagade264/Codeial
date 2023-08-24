const Post= require('../models/post');
const User= require('../models/user');

module.exports.home = async function(req, res) {
    try {
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate('likes')
        .populate(
            { 
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).exec();

        const users = await User.find({});

        return res.render('home', {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users
        });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

