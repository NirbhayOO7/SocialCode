const { request } = require('express');
const express = require('express');
// install cookie-parser module through npm to use cookie in our webpage
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;
const db = require('./config/mongoose');

// install express-session to create the cookies session and encrypted the cookie 
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// import express-ejs-layouts module before processing the request made by browser since we have to render the layout page in response to that request 
const expressLayouts = require('express-ejs-layouts');
const { initialize } = require('passport');

// use middleware to setup cookieParser 
app.use(cookieParser());

// below line will set the expressjs to look for any static at below mentioned location like css js images and etc
app.use(express.static('./assets'));

// extract styles and scripts from sub pages into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// middleware used to decode the encrypted data with the help of bodyparser 
app.use(bodyParser.urlencoded({extended: false}));

app.use(expressLayouts);

app.set('view engine', 'ejs');

app.set('/views', './views');

// use express routes
// middleware is used, below line will route any request(/) to routes folder
app.use('/', require('./routes'));

// instruction app to use the session module to encrypt the cookies sent by browser 
app.use(session({
    name: socailcode,
    // todo change the secret befor deploying in production 
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : (1000 * 60 * 100)
    }
}));

// passport.initialize() is a middle-ware that initialises Passport. 
app.use(passport.initialize());
// passport.session() is another middleware that alters the request object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.
app.use(passport.session());

app.listen(port, function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
