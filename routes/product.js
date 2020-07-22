const express = require("express");
const router = express.Router();

const { isAdmin,isSignedIn,isAuthenticated } = require("../controllers/authenticate");
const { getUserById } = require("../controllers/user");
const { getProductById,createProduct,getSingleProduct,photo,updateProduct,deleteProduct,getAllProducts,getAllUniqCategory } = require("../controllers/product");
//params
router.param("userId",getUserById);
router.param("productId",getProductById);

// create route
router.post(
    "/product/createProduct/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);
//read routes
router.get("product/:productId",getSingleProduct);
router.get("product/icon/:productId",photo);

//update route
router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
  );

//delete route
router.delete(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
  );

//listing route
router.get("/products",getAllProducts);
//category List
router.get("/product/categories",getAllUniqCategory);

module.exports = router;