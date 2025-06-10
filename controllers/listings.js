const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.newListing = async(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showDetails = async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createNewListing = async (req, res, next) => {
    let location = `${req.body.listing.location}, ${req.body.listing.country}`;
    let response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
    }).send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newListing.geometry = response.body.features[0].geometry;
    
    await newListing.save();
    req.flash("success", "New listing Created.");
    res.redirect("/listings");
}

module.exports.editListing = async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist !");
        return res.redirect("/listings");
    }
    
    
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req, res) => {
    let{id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
    req.flash("success","Listing get Updated.");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let{id}=req.params;
    let deleteddata=await Listing.findByIdAndDelete(id);
    console.log(deleteddata);
    req.flash("success","Listing is Deleted."); 
    res.redirect("/listings");
}

