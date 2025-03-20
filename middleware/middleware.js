const usermodel = require("../models/usermodel")
const jwt = require("jsonwebtoken")

module.exports.isLoggedIn = async function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.flash("error", "You must be logged in");
        return res.redirect("/");
    }

    try {
        
        const result = jwt.verify(token, process.env.SECRET_KEY); // Verifies and decodes the token


        const user = await usermodel.findOne({ email: result.email });

        if (!user) {
            req.flash("error", "Invalid user session");
            return res.redirect("/");
        }

        req.user = user;
        next(); // Proceed if user is found
    } catch (err) {
        req.flash("error", "Session expired. Please log in again.");
        return res.redirect("/");
    }
};


module.exports.redirectToProfile = async function(req,res,next){
    const token = req.cookies.token;

    if (! token){
        return next();
        
    }
try{
        let result = jwt.verify(token,process.env.SECRET_KEY)
        if (result)
        return res.redirect("/profile")
        else next();
    
        

    }

    
    
    catch(err){
        req.flash("error" , err.message)
        res.redirect("/")
        return;
    }
}
