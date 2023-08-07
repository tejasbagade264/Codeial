const User = require('../models/user');


module.exports.profile = async function (req, res) {
    try {
        if (req.cookies.user_id) {
            const user = await User.findById(req.cookies.user_id).exec();

            if (user) {
                return res.render('profile', {
                    title: "User Profile",
                    user: user
                });
            }
        } else {
            return res.redirect('/users/sign-in');
        }
    } catch (error) {
        // Handle any errors here
        console.error('Error during profile rendering:', error);
        return res.redirect('/'); // Redirect to a default page or handle the error appropriately
    }
};


module.exports.about =function(req, res){
    return res.end('<h1>name:tejas</h1> <p>marks: 90%</p>');
}

module.exports.signUp= function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}


//render the signup page
module.exports.signIn= function(req, res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

//get the sign up data
// Assuming you have already imported the necessary modules and initialized the User model.

module.exports.create = async function (req, res) {
    try {
        if (req.body.password !== req.body.confirm_password)
            return res.redirect('back');

        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in signing up:', err);
       
    }
}




//sign in and create a session for user

module.exports.createSession = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();

        if (user) {
            if (user.password !== req.body.password) {
                return res.redirect('back');
            }
            // Handle session creation
            res.cookie('user_id', user._id); // Assuming '_id' is the user's unique identifier
            return res.redirect('/users/profile');
        } else {
            // Handle user not found
            return res.redirect('back');
        }

    } catch (error) {
        // Handle any errors here
        console.error('Error during createSession:', error);
        return res.redirect('back');
    }
};

