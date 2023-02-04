const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('dotenv');
env.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    // if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
    auth: {
        user: "uchihanirbhay02@gmail.com",
        pass: process.env.Password
    }
});

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