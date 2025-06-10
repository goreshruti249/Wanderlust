if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


//acesss the connection with all backends
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routers/listing.js");
const reviewsRouter = require("./routers/review.js");
const usersRouter = require("./routers/user.js");

//Database connectivity
main().then(()=>{
    console.log("Connection Successfully.");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

//for view template access
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//for parsing the id value
app.use(express.urlencoded({extended:true}));

//for method overridig set up
app.use(methodOverride("_method"));

//for ejs-mate set up
app.engine('ejs', ejsMate);

//for access the public folder
app.use(express.static(path.join(__dirname,"/public")));

//for access the session id.
const sessionOptions = {
    secret:process.env.SECRET,// Used to sign the session ID cookie (keep this secret in production)
    resave:false,// Don't save session if unmodified
    saveUninitialized :false,// Don't create session until something is stored
    cookie:{
         // Set cookie expiration to 7 days from now
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,// Maximum age in milliseconds (7 days)
        httpOnly: true,// Maximum age in milliseconds (7 days)
    }
};
// Register the session middleware with the configured options
app.use(session(sessionOptions));


// for access the flash
// Enable flash messaging (must be used after session middleware)
app.use(flash());


//for acces the passport
app.use(passport.initialize());// Initialize Passport for authentication
app.use(passport.session());// Enable persistent login sessions using Passport
passport.use(new LocalStrategy(User.authenticate()));// Use local strategy for username/password authentication with Passport

passport.serializeUser(User.serializeUser());// Serialize user instance to the session (determines what data is stored in session)
passport.deserializeUser(User.deserializeUser());// Deserialize user instance from the session (retrieves user data from session)

// Middleware to make flash messages and current user available in all views
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");// Makes "success" flash messages available in templates
    res.locals.error = req.flash("error");// Makes "error" flash messages available in templates
    res.locals.currUser = req.user;// Makes the logged-in user (if any) available in templates
    next(); // Continue to the next middleware or route
   
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"fakeuser@gmail.com",
//         username:"delta-Students",
//     });
//     let registerUser = await User.register(fakeUser,"12345");
//     res.send(registerUser);
// });



//create basic API
// app.get("/",(req,res)=>{
//     res.send("Root is working");
// });



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);


// for ExpressError - showing the specific error message
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// });


//for error handling
// app.use((err,req,res,next) =>{
//     let{statusCode=500,message="Something went wrong"} = err;
//      res.render("error.ejs",{message});
//     // res.status(statusCode).send(message);
// });



//Activate  port
app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});