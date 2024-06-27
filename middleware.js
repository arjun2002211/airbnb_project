const listing = require('./model/listing.js');
const Review = require('./model/review.js');

module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        console.log(req.user);
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', "you must be logged in");
        return res.redirect('/login');
    }
    next();
} ;

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if(!list.owner.equals(res.locals.currentuser._id)){
        req.flash('error', 'You are not the owner of the listing');
        return res.redirect(`/listing/show/${id}`);
    }
    next();
}

module.exports.isauthor = async(req,res,next)=>{
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentuser._id)){
        req.flash('error', "you are not the author of the reivew");
        return res.redirect(`/listing/show/${id}`)
    }
    next();
}