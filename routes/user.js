const express = require("express");
const router = express.Router();

const User = require("../models/user");
const {getUserById, getUser, updateUser,getPurchaseList} = require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/authenticate");

router.param("userId", getUserById);

router.get("/user/:userId",isSignedIn, isAuthenticated ,getUser);    
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser);
router.get("/orders/user/:userId",isSignedIn,isAuthenticated,getPurchaseList);

//thorwing router object outside this file
module.exports = router;