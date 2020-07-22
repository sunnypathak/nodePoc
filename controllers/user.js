const User = require("../models/user");
const Order = require("../models/order");
//get a specific User
exports.getUserById = (req,res, next,id) => {
    User.findById(id).exec((err, user) => {
        if(err || !User){
            return res.status(400).json({
                error: err.msg
            })
        }
        req.profile = user;
        next();
    });
};
//get a single user
exports.getUser = (req,res) => {
    //TODO : get back here for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.__v  = undefined;
    return res.json(req.profile);
};
//Update a user's Info
exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new:true, useFindAndModify:false},
        (err,user) =>{
            if(err ){
                return res.status(400).json({
                    error: err.msg
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            user.__v  = undefined;
            res.json(user);
        }
    );
};
//Get purchase list associated to an user
exports.getPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user","_id name")
    .exec((err,order) => {
        if(err || !order){
            return res.status(400).json({
                error: "No orders found for this acount"
            });
        }
        res.json(order);
    });
};
//puch an user's purchase list in user schema
exports.pushOrderInPurchaseList = (req,res,next) => {
   let purchases =[];
   req.body.order.products.foreach(product => {
       purchases.push({
           _id:product._id,
           name:product.name,
           description:product.description,
           category:product.category,
           quantity:product.quantity,
           amount:req.body.order.amount,
           transaction_id:req.body.order.transaction_id
       })
    });
       User.findOneAndUpdate(
           {_id: req.profile._id},
           {$push:{purchases:purchases}},
           {new:true},
           (err,purchases) =>{
            if(err){
                return res.status(400).json({
                    error:"unable to save purchase List"
                })
            }
            next();
       }
    )
}
