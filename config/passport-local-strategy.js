const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('..models/user');

//authentication using passport 
passport.use(new_LocalStrategy({
    usernameField:'email'
},
  function(email, password, done){
    //find a user and established identity;
    User.findOne({email:email}, function(err,user){
        if(err){console.log('error in finding user');
           return done(err);
         }

         if(!user || user.password != password){
            console.log('Invalid username password');
            return done(null, false);

         }
         return (null, user);
    });
  }
));

//serialized the user 
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
   User.findById(id, function(err,user){
    if(err){console.log('Error in finding user');
  return done(err);
}
   return done(null, user);
   });
});



//check if the user is authenticcated
passport.checkAuthentication = function(req, res,next){
   if(req.isAuthenticated()){
    return next();
   }

   //if user is not signed in 
   return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
  if(req.isAuthenticated()){
     //req.user contains the current signed in user from the session cookie and we're just sending this to local for the views
    res.locals.user = req.user;
  }
}



module.exports=passport;