const Category = require("../models/category");

//get a specific category
exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category) => {
        if(err || !category){
            return res.status(400).json({
                error : "No such category found"
            });
        }

        req.category = category;
        next();
    });
};
//create a new category
exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,category) => {
        if(err){
            return res.status(400).json({
                error : err.msg
            });
        }
        res.json({category});
    })
};
//get all categories at once
exports.getAllCategories = (req,res) => {
    Category.find().exec((err,categories) => {
        if(err){
            return res.status(400).json({
                error : err.msg
            });
        }
        res.json(categories);
    });
};
//get single category
exports.getCategory = (req,res) => {
 return res.json(req.category);
};
//update a category info
exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err,updatedCategory) => {
        if(err){
            return res.status(400).json({
                error : "Failed to Update Category"
            });
        }
        res.json(updatedCategory);
    });
};
//delete category Info
exports.deleteCategory = (req,res) => {
    const category = req.category;
    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error : "Failed to Delete Category"
            });
        }
        res.json({
            message : category.name+" was successfully deleted."
        });
    });
};