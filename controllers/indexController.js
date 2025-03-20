const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userModel = require("../models/usermodel");
const linkmodel = require("../models/linkmodel");
const crypto = require("crypto");
const { log } = require("console");


module.exports.indexController = function(req,res){
    let message = req.flash('error')
    res.render("login",{error:message,isLoggedIn:false});
}
module.exports.profileController = async function (req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("links");  

    res.render("profile", { user, links: user.links });
};


module.exports.createController = function(req,res){
    res.render("create");
}

module.exports.registerController = [ async function(req, res){
    const { username, email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
    req.flash("error", "User already registered");
    res.redirect("/");
    return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = await userModel.create({
        username,
        password: hash,
        email,

    });

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.SECRET_KEY);

    res.cookie("token", token);

    res.redirect("/profile");
}];

module.exports.loginController = async function(req, res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email}).select("+password");
    if (!user){
        req.flash("error" , "User dose not exist")
        res.redirect("/")
        return;
    }
    
    try{
        let result = await bcrypt.compare(password,user.password)
        if (result){
            
            const token =  jwt.sign({
                id: user._id,
                email: user.email
            },process.env.SECRET_KEY)
            
            res.cookie("token", token)
            res.user = user
            res.redirect("/profile")
        }
        else{
            req.flash("error" , "Invalid credentials")
            res.redirect("/")
            return;
        }
    }
        catch(err){
            req.flash("error" , err.message)
            // console.log(err.message);
            
            res.redirect("/")
    }


};



module.exports.postCreateController = async function(req,res){
    let { originalLink , addName} = req.body;
    addName = addName === "on"? true : false;
    
    const timestamp = Date.now().toString(36).slice(-4); 
    const randomStr = crypto.randomBytes(2).toString("base64url").slice(0, 4);
    redirectedLink = `${timestamp}${randomStr}`;

    // console.log(redirectedLink);
    
    
    let link = await linkmodel.create({
        originalLink,
        redirectedLink,
        addName,
        user:req.user._id,

    })
    
    let user = await userModel.findOne({email:req.user.email})
    user.links.push(link._id)
    await user.save();
    res.redirect("/profile")
    
}

module.exports.logoutController = function(req,res){
    res.cookie("token","")
    return res.redirect("/")
}


module.exports.redirectController = async function(req, res){
    const { id } = req.params;

    
    const link = await linkmodel.findOne({redirectedLink: id });

    
    if (link == null) {
        res.render("notfound")
        return;
    }
    res.redirect(link.originalLink);

};

module.exports.logoutController = function(req,res){
    res.cookie("token","")
    return res.redirect("/")
}


module.exports.deleteController = async function(req,res){

    const { id } = req.params;
    let link = await linkmodel.findOneAndDelete({redirectedLink: id});
    res.redirect("/profile")
    return;
};