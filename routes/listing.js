const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync.js");
const { isLoggedIn, isOwner, isValidateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(WrapAsync(listingController.index))  //Index Route
    .post(isLoggedIn, upload.single('listing[image]'), isValidateListing, WrapAsync(listingController.createListing));  //Create Route

router
    .route("/location")
    .get(WrapAsync(listingController.showListingLocation));

// Add New Route
router.get("/new", isLoggedIn, listingController.newListingRender);

// For category route
router
    .route("/category")
    .get(WrapAsync(listingController.showListingCategory));//Category wise show route

router
    .route("/:id")
    .get(WrapAsync(listingController.showListing)) //Show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), isValidateListing, WrapAsync(listingController.updateListing)) //Update Route
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.destroyListing)); //Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.editListing));

module.exports = router;