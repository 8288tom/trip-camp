const express = require("express")
// mergeParams:true is to merge the parameters from the app file
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews")
const catchAsync = require("../utils/catchAsync"); // instead of try/catch on every async function 
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;