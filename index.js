const express =require('express');
const cookieParser = require('cookie-parser'); 
const app = express();
const port = 8000;
const db=require('./config/mongoose');

app.use(express.urlencoded());

app.use(cookieParser());

const expressLayouts= require('express-ejs-layouts');
app.use(express.static('assets'));
app.use(expressLayouts);

// extract style and scripts from subpages into the layoutt
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//use express router
app.use('/', require('./routes'));

//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');




app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`server is running on port: ${port}`);
});