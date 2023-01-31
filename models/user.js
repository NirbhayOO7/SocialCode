const mongoose = require('mongoose');
const multer = require('multer'); // multer module is installed using npm, it will be used to interact with uploaded files
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// Multer will not process any form which is not multipart (multipart/form-data)

const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    avatar: { // avatar field in the database will only hold the address of the uploaded not the acutal file
        type : String
    }
},{
    timestamps: true
});

const storage = multer.diskStorage({  // in this line we have defined that we are using disk storage to save the uploaded file.
    destination: function (req, file, cb) { // destination field will define where the uploaded files will be saved.
      cb(null, path.join(__dirname , '..' , AVATAR_PATH));
    },
    filename: function (req, file, cb) { // filename field is used to define the filename by which the uploaded file will be saved.
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //since many users can save file with same name so we have used a const uniqueSuffix which will added after the filename and then
    // that file will be saved in our storage
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
  
  
// static functions/methods (funcitons which belongs to a class rather than a single object(same concept as java class and object))
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');

//   what above line will do that will assign the storage variable which we have defined in line 33 to stroage field which is present inside
//   multer module. 
//.single() function denotes that only single file will be taken while uploading not multiple files at once, and 'avatar' inside it
// defines the name of saved file will start with avatar 

userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;