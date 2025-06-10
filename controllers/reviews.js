const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async(req,res) =>{
    // Find the listing by its ID from the URL
    let listing = await Listing.findById(req.params.id);

    // Create a new Review using data submitted in the form (req.body.review)
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currUser._id;
    
     // Add the new review's ObjectId to the listing's reviews array
    listing.reviews.push(newReview);
    

    // Save the new review to the 'reviews' collection
    await newReview.save();

     // Save the updated listing to store the reference to the new review
    await listing.save();

    req.flash("success","Review Created."); 

    // Redirect the user back to the listing's detail page
    res.redirect(`/listings/${listing.id}`);
    
}

module.exports.deleteReview = async(req,res)=>{
    // Destructure listing ID and review ID from URL parameters
    let{id,reviewId} = req.params;

    // Update the listing: remove the review ID from the reviews array using $pull
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});

     // Delete the review document from the database
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted."); 

     // Redirect the user back to the listing's detail page
    res.redirect(`/listings/${id}`);
}