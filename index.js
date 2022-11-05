const { request } = require('express');
const express = require('express');
const app = express();
const port = 8000;

// use express routes
// middleware is used, below line will route any request(/) to routes folder
app.use('/', require('./routes'));

app.set('view engine', 'ejs');

app.use('/views', './views');

app.listen(port, function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
