const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../Utils/WrapAsync.js");
const { isValidateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js")

// Get Route for review
router.get("/", WrapAsync(reviewController.getReviewPage));

// Review Route
router.post("/", isLoggedIn, isValidateReview, WrapAsync(reviewController.createReview));

// Delete review 
router.delete("/:reviewId", isLoggedIn, isAuthor, WrapAsync(reviewController.destroyReview))


module.exports = router;

