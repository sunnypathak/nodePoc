const User = require("../models/user");
const {check , validationResult} = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req,res) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

    const user = new User(req.body)
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                error: err.errmsg 
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
};

exports.signin =(req,res) => {
 const {email, password} = req.body;//dextructuring of data getting in request

 const errors = validationResult(req);
 var errJsonObj = JSON.parse('{"faultyFields":[]}');
if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }
 if(!errors.isEmpty()){
     return res.status(422).json(errJsonObj['faultyFields']);
 }

 User.findOne({email},(err, user) => {
    if(err || !user){
        return res.status(400).json({
            error: "USER NOT FOUND IN DATABASE"
        });
    }

    if(!user.authenticate(password)){
        return res.status(401).json({
           error: "INVALID PASSWORD"
        });
    }
   
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
   
    //put token in cookie
    res.cookie("token",token, new Date()+999);
    
    //send response to frontend
    const {_id,name,email,role} = user;
    return res.json({token,user :{_id, name,email,role}});
   

 });
};

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message : "User is Signed Out"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});
//Custom Middlewares
exports.isAuthenticated = (req,res,next) => {
    var checker = req.profile && req.auth && (req.profile._id == req.auth._id);
    if(!checker){
       return res.status(403).json({
           error: "Access Denied"
       });
    }
    next();
};

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === "0"){
        return res.status(403).json({
            error:"Admin Rigths Required !! ACCESS DENIED"
        }); 
    }
    next();
};
