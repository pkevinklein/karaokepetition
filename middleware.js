//middleware
app.use ((req, res, next) => {
    //for all routes
    if (!req.session.userId && req.url != "/register" && req.url != "/login"){
        return res.redirect("/register");
    } else {
        next();
    }
});
//
exports.requireLoggedOutUser = function (req, res, next ){
    if(!req.session.userId){
        res.redirect("/petition");
    }else {
        next();
    }
};
exports.requireNoSignature = function (req, res, next ){
    if(req.session.sigId){
        res.redirect("/thanks");
    }else {
        next();
    }
};
exports.requireSignature = function (req, res, next ){
    if(!req.session.sigId){
        res.redirect("/thanks");
    }else {
        next();
    }
};
//
