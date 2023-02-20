const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');
const env = require('./environment');
dotenv.config();

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath), // relativePath is the location from where this function is being called.
        data,
        function(err, template){
            if(err){console.log('error in rendering template', err); return;};

            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}