const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const flash=require('connect-flash');
const customMware = require('./config/middleware');
const path = require('path');
const passportGoogle= require('./config/passport-google-oauth2-strategy');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//const MongoStore = require('connect-mongo')(session);
const MongoStore=require('connect-mongo');
const passportJWT = require('./config/passport-jwt-strategy');

 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);

//makes the upload part available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100 // Fixed the syntax here
    },
    store: MongoStore.create({
        //session to intract with mongoose
        mongoUrl:'mongodb://127.0.0.1:27017/codeial_development',
        // mongooseConnection:db,
        //do i want to remove automatically is disabled
        autoRemove:'disabled'
    },
    function(err){
        console.log(err || 'connect-mongoose setup OK');
    })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.use('/api', require('./routes/api'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});