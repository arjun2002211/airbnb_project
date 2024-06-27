const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedin, isauthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

// new review Route
router.post('/',isLoggedin, wrapAsync(reviewController.postReview));

// delete review route

router.delete('/:reviewId',isLoggedin, isauthor, wrapAsync(reviewController.deleteReview));

module.exports = router;