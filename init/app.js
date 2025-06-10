// Import mongoose for MongoDB interaction
const mongoose=require("mongoose");
const initData=require("./data.js");// Import seed data from local file
const Listing=require("../models/listing.js");// Import the Listing model

// Connect to MongoDB and log result
main().then(()=>{
    console.log("Connection Successfully.");
}).catch(err => console.log(err));

// Async function to connect to MongoDB using Mongoose
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
 // Connects to the local MongoDB server and uses (or creates) the 'Wanderlust' database
}

// Function to initialize the database with fresh data
const initDB = async()=>{
     await Listing.deleteMany({});// Delete all existing listings in the collection to prevent duplication
     
     // Add a hardcoded owner ID to each listing object (simulating ownership)
     initData.data = initData.data.map((obj)=>({...obj,owner:"683dc2afa17215759cded421"}))// Make sure this ID exists in the users collection
     
     // Insert the updated data into the database
     await Listing.insertMany(initData.data);
     console.log("data was initalized");// Log success message
};

// Run the DB initialization
initDB();
