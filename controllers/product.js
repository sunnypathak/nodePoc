const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//Param
exports.getProductById = (req,res,next,id) => {
    Product.findById(id).exec((error,product) => {
        if(error || !product){
            return res.status(400).json({
                error : "No Product Found"
            });
        }
        req.product = product;
        next();
    });
}

//Create
exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,files) => {
        if(err){
            return res.status(400).json({
                error : err.msg
            });
        }
        //destructure fields
        const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

        //handling fields
        const product = new Product(fields);

        //handling files
        if(files.icon){
            if(files.icon.size > 3000000){
                res.status.json({
                    error :"File can't be greater than 3MB"
                })
            }
            product.icon.data = fs.readFileSync(files.icon.path);
            product.icon.contentType = files.icon.type;
        }
        
        //Saving into DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error : err.msg
                });
            }
            res.json(product);
        });
    })
};
//erad product by Id
exports.getSingleProduct = (req,res) => {
    req.product.icon = undefined;
    res.json(req.product);
};
//read photo
exports.photo = (req,res,next) =>{
    if(req.product.icon.data){
        res.set("Content-type",req.product.icon.contentType);
        return res.send(req.product.icon.data);
    }
    next();
};
//update product by id
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,files) => {
        if(err){
            return res.status(400).json({
                error : err.msg
            });
        }

        //handling fields
        const product = req.product;
        product = _.extend(product,fields);

        //handling files
        if(files.icon){
            if(files.icon.size > 3000000){
                res.status.json({
                    error :"File can't be greater than 3MB"
                })
            }
            product.icon.data = fs.readFileSync(files.icon.path);
            product.icon.contentType = files.icon.type;
        }
        
        //Saving into DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error : "Upation of product failed"
                });
            }
            res.json(product);
        });
    })
};
//delete product by Id
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: err.msg
            });
        }
        res.json({
            message: deletedProduct + " removed successfully"
        })
    });
};
//listing products
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-icon")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products) => {
        if(err){
            return res.status(400).json({
                errror: "No products found"
            })
        }
        res.json(products);
    });
};
//list unique categories
exports.getAllUniqCategory = (req,res) => {
    Product.distinct("category",{},(err, categories) => {
        if(err){
            return res.status(400).json({
                error : "Not able to fetch unique categories"
            });
        }
        res.send(categories);
    });
};

//update stock
exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter:{_id: product._id},
                update:{$inc:{sold : -product.count,stock : +product.count}}
            }
        };
    });

    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error:"Bulk Operation Failed"
            });
        }
        next();
    }); 
};
