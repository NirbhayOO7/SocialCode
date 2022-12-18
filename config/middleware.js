module.exports.setFlash = function(req, res, next){
    res.locals.flash = {                                // here we setup the flash messages in res.locals as we need to use flash messages in ejs/html files (to show the flash messages to user).
        'success' : req.flash('success'),
        'error' : req.flash('error')
    }

    next();
}

// we are using the connect flash module only becuase when we refresh the page we want the flash messages not to be shown, as we only want 
// to show the flas messages only once otherwise we could just simply set the message in locals for successfull log in log out etc. and then
// use it in the ejs files