const { request } = require('express');
const express = require('express');
const app = express();
const port = 8000;

app.set('view engine', 'ejs');

app.set('/views', './views');

// use express routes
// middleware is used, below line will route any request(/) to routes folder
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
