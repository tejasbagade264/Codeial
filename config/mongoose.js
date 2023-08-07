const mongoose= require('mongoose');

//mongoose.connect('mongodb://localhost/codeial_developement');
mongoose.connect('mongodb://127.0.0.1/codeial_developement', {
});

const db=mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to database:MongoDB');
});

module.exports = db;