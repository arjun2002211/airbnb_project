const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedin, saveRedirectUrl, isOwner } = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudconfig.js');
const upload = multer({ storage });


// // render new Listing Form route
router.route('/new').get(isLoggedin, listingController.renderNewForm).post(upload.single('image'), wrapAsync(listingController.createNewListing));

// edit listing route
router.route('/edit/:id').get(isLoggedin, isOwner, wrapAsync(listingController.updateListingForm)).put(upload.single('image'), wrapAsync(listingController.editListing));

// show listing route
router.get('/show/:id', wrapAsync(listingController.showListings));

// Delete Listing Route
router.delete('/delete/:id', isLoggedin, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;