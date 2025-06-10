const express=require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userControllers = require("../controllers/users.js");


// for sign up the newly users
// router.get("/signup",userControllers.signup);

router.route("/signup")
.get(userControllers.signup)
.post(userControllers.signWithLogin);

// Handle user signup with login
// router.post("/signup",userControllers.signWithLogin);


//for login the registered users
// router.get("/login",userControllers.login);


router.route("/login")
.get(userControllers.login)
.post(saveRedirectUrl,// Middleware to retrieve any stored redirect URL (if user tried accessing a protected route before logging in)
     // Authenticate using Passport's local strategy
    passport.authenticate("local",{
    failureRedirect:"/login",// Redirect back to login page if authentication fails
    failureFlash:true, // Show flash message on failure (e.g., "Invalid username or password")
}),userControllers.loginRedirectUrl);


//login page redirect to previous mention page
/*router.post("/login",saveRedirectUrl,// Middleware to retrieve any stored redirect URL (if user tried accessing a protected route before logging in)
     // Authenticate using Passport's local strategy
    passport.authenticate("local",{
    failureRedirect:"/login",// Redirect back to login page if authentication fails
    failureFlash:true, // Show flash message on failure (e.g., "Invalid username or password")
}),userControllers.loginRedirectUrl);*/



// Handle user logout
router.get("/logout",userControllers.logout);

module.exports = router;