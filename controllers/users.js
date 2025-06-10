const User = require("../models/user");

module.exports.signup = async(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signWithLogin = async(req,res)=>{
    try{
        // Destructure form data from the request body
        let{username,email,password} = req.body;

        // Create a new user instance (without password for now)
        const newUser = new User({email,username});

        // Register the user using Passport-Local Mongoose, which handles hashing/salting the password
        const registereUser = await User.register(newUser,password);
        
        console.log(registereUser); // Optional: log the new user for debugging
        
        // Automatically log the user in after successful registration
        req.login(registereUser,(err)=>{
            if(err){
                return next(err);// Pass error to Express error handler
            }
            // Set a flash message to show upon redirect
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings"); // Redirect to the main listings page
        })
        
    }
    catch(e){
       // Handle any errors (e.g., username/email already in use)
       req.flash("error",e.message);
       res.redirect("/signup");// Redirect back to the signup form
    }
   
}

module.exports.login = async(req,res)=>{
   res.render("users/login.ejs");
}

module.exports.loginRedirectUrl = async(req,res)=>{
    // Set a success flash message
    req.flash("success","Welcome back to WanderLust !");
    
    // Redirect the user to the original destination (if saved), or default to "/listings"
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = async(req,res,next) =>{
    // Passport's logout method to end the user's session
    req.logout((err) =>{
    if(err){
        // If there's an error during logout, pass it to Express's error handler
        return next(err);
    }
     // Set a flash message to confirm logout
    req.flash("success","You are logged out!");
    res.redirect("/listings"); // Redirect the user to the listings page (or homepage)
    });
}