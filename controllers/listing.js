const listing = require('../model/listing');
const { listingSchema } = require('../joischema.js');
const ExpressError = require('../utils/ExpressError.js');


// Home route
module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render('index.ejs', { allListings });
};

// new Listing form
module.exports.renderNewForm = (req, res) => {
    res.render('new.ejs');
};


// show listing 
module.exports.showListings = async (req, res, next) => {
    try {
        let { id } = req.params;
        let list = await listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' }, },).populate('owner');
        let geolocation = list.location;
        let url = `https://geocode.maps.co/search?q=${geolocation}&api_key=667b95557e4b8902466707tpia17cff`;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data[0]);
        if (!list) {
            req.flash('error', 'listing you are trying for doesnt exist');
            res.redirect('/home')
        }
        // console.log(currentuser);
        res.render('show.ejs', { list, data });
    }
    catch (err) {
        throw new ExpressError('page not found', 400);
    }
};

// create new Listing
module.exports.createNewListing = async (req, res, next) => {
    let location = req.body.location;
    let url = `https://geocode.maps.co/search?q=${location}&api_key=667b95557e4b8902466707tpia17cff`;
    let response = await fetch(url);
    let CoordinateResult = await response.json();
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }
    console.log(req.file);
    let newlist = new listing(req.body);
    if (req.file) {
        let filename = req.file.originalname;
        let url = req.file.secure_url;
        newlist.image.url = url;
        newlist.image.filename = filename;
        // await newlist.save();
    };
    newlist.owner = req.user._id;
    newlist.geometry = { type: "Point", coordinates: [CoordinateResult[0].lon, CoordinateResult[0].lat] }
    let savedList = await newlist.save();
    console.log(savedList);
    req.flash('success', 'new listing created');
    res.redirect('/home');
}

// update listing method
module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }
    let newlist = await listing.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true, });
    // console.log(req.file)
    if (req.file) {
        let filename = req.file.originalname;
        let url = req.file.secure_url;
        newlist.image.filename = filename;
        newlist.image.url = url;
        // await newlist.save();
    }
    await newlist.save();
    console.log(newlist);
    req.flash('success', 'Listing Updated');
    res.redirect(`/listing/show/${id}`);
};

// update listing form
module.exports.updateListingForm = async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    let imgurl = list.image.url;
    imgurl = imgurl.replace('/upload', '/upload/ar_1.0,c_fill,h_150,w_200/');
    res.render('edit.ejs', { list, imgurl });
};

// delete Listing 
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted');
    res.redirect('/home');
};