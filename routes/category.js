const express = require("express");
const router = express.Router();

const {getCategoryById,createCategory,getAllCategories,getCategory,updateCategory,deleteCategory} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/authenticate");
//params
router.param("userId", getUserById);
router.param("categoryId",getCategoryById);
// create Routes starts here
router.post(
    "/category/creatCategory/:userId", 
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);
//read
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategories);
//update
router.put(
    "/category/updateCategory/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);
//delete
router.delete(
    "/category/deleteCategory/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAuthenticated,
    isAdmin,
    deleteCategory
)
module.exports = router;