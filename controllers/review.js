const { reviewSchema } = require('../joischema.js');
const ExpressError = require('../utils/ExpressError.js');
const listing = require('../model/listing.js');
const Review = require('../model/review.js');


// post review Route
module.exports.postReview = async (req, res) => {
    let { id } = req.params;
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }

    let newlist = await listing.findById(id);
    let newreview = new Review(req.body);
    newreview.author = req.user._id;
    // console.log(newreview);
    newlist.reviews.push(newreview);
    await newreview.save().then(res => {console.log(res)});
    await newlist.save();
    req.flash('success', 'New review saved');
    res.redirect(`/listing/show/${id}`);
};

// Delete Review Route 

module.exports.deleteReview =  async (req, res) => {
    let { id, reviewId } = req.params;
    let newlist = await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    console.log(newlist);
    let result = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review got deleted');
    return res.redirect(`/listing/show/${id}`);
}


