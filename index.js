
const express = require('express');
// install cookie-parser module through npm to use cookie in our webpage
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;
const db = require('./config/mongoose');
const env = require('dotenv');

// setup the chat server to be used with socket.io(we can also write below lines in different file for scalibility purpose)
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

// install express-session to create the cookies session and encrypted the cookie 
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');  // jwt stragtegy is used for user authentication as we can not use session-cookies in case of API calls. 
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// import express-ejs-layouts module before processing the request made by browser since we have to render the layout page in response to that request 
const expressLayouts = require('express-ejs-layouts');
const { Store } = require('express-session');

// install connect-mongo to use module connect-mongo, connect-mongo is used to store the session data in our mongo db we do this because whenever our server restart our web page should not delete the session info.
const MongoStore = require('connect-mongo');
// install node-sass-middleware to use scss in our webpage for styling.
const sassMiddleware = require('node-sass-middleware'); 
const { deserializeUser } = require('passport');
const { Strategy } = require('passport-local');

const flash = require('connect-flash'); // intall connect flash using npm, connect flash is used to show flash messages.
const customMware = require('./config/middleware');  //we will use this to setup the flash message in 'res'( because in controllers we setup the flash messages in req)

// we need to include sassMiddleware using middlware befor anything else ass we need the css files which converted from scss to be processed by other functionalites of server and then present it in the browser 
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug : true,
    outputStyle:'extended',
    prefix: '/css'
}));

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


// encrypt the id which we save in the session cookie using serializeUser 
app.use(session({
    name: 'socailcode',
    // todo change the secret befor deploying in production 
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : (1000 * 60 * 100)
    },

    // mongo store is used to store the session data in mongo db so that when web server is restarted the user should not logout of session
    // below part of code is little bit of different because the mongo connect version has been upgraded.
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/SocailCode_devlopment_new',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

// passport.initialize() is a middle-ware that initialises Passport. 
app.use(passport.initialize());
// console.log('** in between**');
// passport.session() is another middleware that alters the request object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.
app.use(passport.session());
// passport.session is used to call deserializeUser function from passport-local-Strategy module to check the user which is currently sending the request 
// and the id which will be sent to deserializeUser is the session id which is stored in cookies(which we save using serializedUser)
app.use(passport.setAuthenticatedUser);

// we will set flash to be used after we setup the session as flash usses session for storing the flash messages. 
app.use(flash());
app.use(customMware.setFlash);

app.use('/uploads', express.static(__dirname+'/uploads'));

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