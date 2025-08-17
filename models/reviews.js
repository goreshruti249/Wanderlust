// Import Mongoose to define schema and interact with MongoDB
const mongoose=require("mongoose");
// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;


// ----------------------------------------
// Define the schema for a Review document
// ----------------------------------------
const reviewSchema = new Schema({
    // Comment provided by the user for a listing
    comment :String,
    rating :{
        type : Number,
        min:1, // Minimum value allowed is 1
        max:5   // Maximum value allowed is 5
    },
    // Date and time when the review was created
    createAt:{
        type :Date,
        default:Date.now // Automatically set the current date/time when a review is created
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});


// ---------------------------------------------------
// Create and export the Review model based on schema
// ---------------------------------------------------
// This model allows us to interact with the 'reviews' collection in MongoDB
module.exports = mongoose.model("Review",reviewSchema);