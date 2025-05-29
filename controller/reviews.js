const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.getReviewPage = async (req, res) => {
    const { id } = req.params;  // Get the listing ID
    const listing = await Listing.findById(id).populate("reviews");  // Fetch the listing with reviews
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");  // Redirect if listing is not found
    }
    res.redirect(`/listings/${id}`);  // Render reviews page with the listing data
};


module.exports.createReview = async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "Review Created successfuly!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const result = await Review.findById(reviewId);
    console.log(result);
    req.flash("success", "Review deleted !!");
    res.redirect(`/listings/${id}`);
};