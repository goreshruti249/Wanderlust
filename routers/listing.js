const express=require("express");
const router = express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controllers/listings.js");
//index route
//access for the views template
// router.get("/", listingControllers.index);

/* The router.route() method in Express.js allows you to chain multiple HTTP methods (GET, POST, etc.) 
 for a single route path, making code cleaner and more organized.*/
router.route("/")
.get(listingControllers.index)
.post(isLoggedIn,upload.single('listing[image]'),listingControllers.createNewListing);



//new route - for creating the new listing.
router.get("/new",isLoggedIn,listingControllers.newListing);


//new route for adding the new listing not working due to place below the id because "/listing/new" in this server consider new word as an id.
//so ther is need to write "/listing/new code above the show route."

//show route for an individual name
// router.get("/:id",listingControllers.showDetails);

router.route("/:id")
.get(listingControllers.showDetails)
.put(isLoggedIn,isOwner,upload.single('listing[image]'), listingControllers.updateListing)
.delete(isLoggedIn,isOwner,listingControllers.deleteListing);

//create  route - post newly listing into the home page of the webside
// router.post("/",listingControllers.createNewListing);



//edit route :
router.get("/:id/edit",isLoggedIn,isOwner,listingControllers.editListing);

//update route :edited portion print on the main web page
// router.put("/:id",isLoggedIn,isOwner, listingControllers.updateListing);


//delete route :for delete the listings from the database
// router.delete("/:id",isLoggedIn,isOwner,listingControllers.deleteListing);

module.exports = router;