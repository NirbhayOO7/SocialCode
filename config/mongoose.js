const mongoose = require('mongoose');
const env = require('./environment.js'); 
mongoose.set("strictQuery", false); //this line is used just to suppress an alert showing on terminal while starting up the server
// mongoose.connect('mongodb://localhost/SocailCode_devlopment');
// mongoose.connect('mongodb://localhost/SocailCode_devlopment_new');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;