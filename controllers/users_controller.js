const User = require('../models/user');
const path = require('path');
const fs= require('fs');


module.exports.profile = async function(req, res) {
    try {
        const user = await User.findById(req.params.id).exec();

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (error) {
        console.log('Error:', error);
        // Handle error or send an error response if needed
        // return res.status(500).send('Internal Server Error');
    }
};


module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try {
            let user = await User.findByIdAndUpdate(req.params.id, req.body);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                console.log('Multer Error', err);
               }

      

                user.name= req.body.name;
                user.email =req.body.email;

                if(req.file){
                    // this is saving the path of the uploaded file into the avatar field in the user
                  
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                   user.avatar = User.avatarPath + '/' + req.file.filename;
                  
                }
                user.save();
                return res.redirect('back');
            });
             
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
           
        }
    } else {
        req.flash('error', 'Unauthorised');
        return res.status(401).send('unauthorized');
    }
}



// render the sign up page
module.exports.signUp = async function(req, res) {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/users/profile');
        }

        return res.render('user_sign_up', {
            title: 'Codeial | Sign Up',
           
        });
    } catch (error) {
        console.log('Error:', error);
      //  return res.status(500).send('Internal Server Error');
    }
}

// render the sign in page
module.exports.signIn = async function(req, res) {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/users/profile');
        }

        return res.render('user_sign_in', {
            title: 'Codeial | Sign In',
           
        });
    } catch (error) {
        console.log('Error:', error);
       // return res.status(500).send('Internal Server Error');
    }
}

// get the sign up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            req.flash('error', 'password doesnt match');
            return res.redirect('back');
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const newUser = await User.create(req.body);
            console.log('New user created:', newUser);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error:', error);
        //return res.status(500).send('Internal Server Error');
    }
}

// sign in and create a session for the user
module.exports.createSession = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();

        if (user) {
            if (user.password !== req.body.password) {
                req.flash('error', 'Incorrect password'); // Set the flash error message
                return res.redirect('back');
            }
            // Handle session creation
            res.cookie('user_id', user._id); // Assuming '_id' is the user's unique identifier
            req.flash('success', 'Logged in Successfully');
            return res.redirect('/');
        } else {
            // Handle user not found
            req.flash('error', 'User not found'); // Set the flash error message
            return res.redirect('back');
        }
    } catch (error) {
        // Handle any errors here
        console.error('Error during createSession:', error);
        req.flash('error', 'An error occurred'); // Set a general error message
        return res.redirect('back');
    }
};




module.exports.destroySession = async function(req, res) {
    try {
        await new Promise((resolve, reject) => {
            req.logout(function(err) {
                if (err) {
                    // Reject the promise with the error if logout fails
                    reject(err);
                } else {
                    // Resolve the promise if logout succeeds
                    resolve();
                }
            });
        });

        // Redirect the user after successfully logging out
        req.flash('success', 'you have logged out')
        return res.redirect('/');
    } catch (error) {
        // Handle any error that occurred during logout
        console.error(error);
        // You might want to display an error page or a message to the user
        return res.redirect('/');
       }
}




