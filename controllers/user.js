const User = require('../model/user.js');
const user = require('../model/user.js');


// signup form Route
module.exports.signupForm =  (req, res) => {
    res.render('users/signup.ejs');
};

// post signup route
module.exports.postSignup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash('success', "Account created sucessfully");
            res.redirect('/home');
        })
    }
    catch (error) {
        req.flash('success', error.message);
        res.redirect('signup');
    }
};

// Render Login Form
module.exports.renderLoginForm =  (req, res) => {
    res.render('users/login.ejs');
};


// Post login Route

module.exports.postLogin = async (req, res) => {
    req.flash('success', "congrats You are logged in ");
    // console.log(res.locals.redirectUrl)
    if (res.locals.redirectUrl) {
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect('/home');
    }
};

// logout Route

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        else {
            req.flash('success', 'You are logged out successfully');
            res.redirect('/home');
        }
    })
};