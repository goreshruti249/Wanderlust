const Listing = require("./models/listing");
const Review = require("./models/reviews");

// Middleware to check if the user is authenticated (logged in)
module.exports.isLoggedIn = (req,res,next)=>{
   // If the user is not authenticated
    if(!req.isAuthenticated()){
        // Store the original URL the user was trying to access
        req.session.redirectUrl = req.originalUrl;

        // Set an error flash message to be displayed after redirect
        req.flash("error","You must be logged in.");

         // Redirect the user to the login page
        return res.redirect("/login");
    }
    // If user is authenticated, proceed to the next middleware or route handler
    next();
};


// Middleware to pass the saved redirect URL (if any) to the views
module.exports.saveRedirectUrl = (req,res,next)=>{
    // If there's a redirect URL stored in session
    if(req.session.redirectUrl){
        // Make it available to templates (like after successful login)
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    // Continue to the next middleware or route handler
    next();
};


module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You don't have access to Modification.");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    console.log("Review ID:", reviewId);
    console.log("Review found:", review);
    console.log("Current user ID:", res.locals.currUser?._id);
    // Check if review exists
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not author of this listing.");
      return res.redirect(`/listings/${id}`);
    }
    next();
};