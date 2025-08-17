// Import Mongoose for MongoDB interaction
const mongoose=require("mongoose");
// Extract Schema constructor from mongoose
const Schema = mongoose.Schema;
// Import the Review model so we can reference and delete associated reviews
const Review = require("./reviews.js");


// -----------------------------
// Define the Listing Schema
// -----------------------------
const listingSchema=new mongoose.Schema({
    // Title of the listing - required field
    title:{
        type:String,
        required:true // Typo: should be 'required'
    },
    // Description of the listing - optional field
    description:{
        type:String
    },
    // Image URL for the listing
    image:{
        url:String,
        filename:String,
    },
    // Price of the listing
    price:{
        type:Number
    },
    // Location (city or area) of the listing
    location:{
        type:String
    },
    // Country of the listing
    country:{
        type:String
    },
    // Array of associated review IDs (ObjectId references to Review model)
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },

});

// --------------------------------------------
// Post middleware: Cleanup reviews after delete
// --------------------------------------------
// This middleware runs after a listing is deleted using findOneAndDelete (includes findByIdAndDelete)
// It removes all reviews that are associated with the deleted listing
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        // Delete all reviews whose _id is in the listing.reviews array
        await Review.deleteMany({_id: {$in: listing.reviews}});

    }
    
});


// -----------------------------
// Create and export the Listing model
// -----------------------------
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
