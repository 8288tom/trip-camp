const Campground = require("../models/campground");
const Review = require("../models/review")

module.exports.createReview = async (req, res) => {
    const { id } = req.params
    const review = new Review(req.body.review)
    const campground = await Campground.findById(id)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "New Review Submitted!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    // From the reviews array pull the reviewId to get rid of the reference in the campground:
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/campgrounds/${id}`)
}