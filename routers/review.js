const express=require("express");
const router = express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review = require("../models/reviews.js");
const {isReviewAuthor} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
 
const reviewControllers = require("../controllers/reviews.js");

// Route: Add a new review to a specific listing
router.post("/", isLoggedIn,reviewControllers.createReview);


// Route: Delete a review from a specific listing (by ID)
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewControllers.deleteReview);

module.exports = router;