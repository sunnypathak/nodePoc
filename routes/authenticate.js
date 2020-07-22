var express = require("express");
var router = express.Router();
const {signout, signup, signin, isSignedIn} = require("../controllers/authenticate");
const {check , validationResult} = require("express-validator");

//routes section starts
router.post("/signup",[
    check("name","Name should be of 3 characters").isLength({min:3}),
    check("email","Email is Reuired").isEmail(),
    check("password","Password should contain min. 5 Characters").isLength({min:5})
],signup);

router.post("/signin",[
    check("email","Email is Reuired").isEmail(),
    check("password","Password should contain min. 5 Characters").isLength({min:5})
],signin);

router.get("/signout",signout);

//throwing route object outside
module.exports = router;