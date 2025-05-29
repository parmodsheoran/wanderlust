const Listing = require("../models/listing.js");
const getCoordsForAddress = require("../Utils/location.js");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};


module.exports.newListingRender = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.showListingCategory = async (req, res) => {
    const search = req.query.category;

    // Check if the category is provided
    if (search) {
        const allListing = await Listing.find({ category: search });
        res.render("listings/index.ejs", { allListing });
    } else {
        res.status(400).send('Category parameter is required');
    }
};


module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(req.body.listing.location);
    } catch (err) {
        return next(err);
    }
    console.log(coordinates);
    const newListing = new Listing(req.body.listing);
    newListing.image = { filename, url };
    newListing.owner = req.user._id;
    newListing.geometry.type = 'Point';
    newListing.geometry.coordinates = coordinates;
    // console.log(newListing);
    newListing.save();
    req.flash("success", "New Listing created successfuly!");
    res.redirect("/listings");
};


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exits!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_250,e_blur:300");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
        listing.save();
    }
    req.flash("success", "Listing Updated successfuly!");
    res.redirect("/listings");
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success", "Listing deleted successfuly!");
    res.redirect("/listings");
};


// For Search Button
module.exports.showListingLocation = async (req, res) => {
    const destination = req.query.destination; // Get the 'destination' parameter from the URL
    console.log(destination);
    // Check if the category is provided
    if (destination) {
        const allListing = await Listing.find({
            $or: [
                { location: { $regex: destination, $options: 'i' } }, // Case-insensitive partial match
                { country: { $regex: destination, $options: 'i' } }  // Case-insensitive partial match
            ]
        });
        console.log(allListing);
        res.render("listings/index.ejs", { allListing });
    } else {
        req.flash("success", "Please enter valid destination");
        res.redirect("/listings");
    }
};