module.exports.profile = function(req, res){
    return res.render('users',{
        username : "Nirbhay",
        title: "profile"
    })
}