const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/SocailCode_devlopment');
mongoose.connect('mongodb://localhost/SocailCode_devlopment_new');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;