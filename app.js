if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const mongoUrl = process.env.ATLASDB_URL;
const express = require("express");
let app = express();
const port = 3000;
const mongoose = require('mongoose');
const listing = require('./model/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const path = require('path');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user.js');

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

main().then(res => { console.log("database connected") }).catch(err => { console.log(err) });

async function main() {
    await mongoose.connect(mongoUrl);
};


// app.use
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
// method override
app.use(methodOverride('_method'));
const store = MongoStore.create({
    mongoUrl: mongoUrl,
    crypto: {
        secret: process.env.SUPER_SECRET, 
    },
    touchAfter: 24 * 3600
});

store.on('err',()=> {
    console.log('eroor occured in mongo session store');
});
const sessionOption = ({
    store: store,
    secret: process.env.SUPER_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// root route
app.get('/', (req, res) => {
    res.send("hi this is root path <br> <h1> To see this tutorial go to '/home'</h1>")
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentuser = req.user;
    next();
});

app.get('/fakeuser', async (req, res) => {
    let fakeUser = new User({
        email: "Arjunstudent@gmail.com",
        username: "arjun",
    });
    let registerUser = await User.register(fakeUser, "arjun@2211");
    res.send(registerUser);
    ;
})

app.use('/listing/:id/review', reviewsRouter);
app.use('/listing', listingsRouter);
app.use('/', userRouter);

// home route
app.get('/home', wrapAsync(async (req, res) => {
    let allListings = await listing.find({});
    res.render('index.ejs', { allListings });
}));


// error handling middlewares

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    let { message = ' something went wrong', status = 500 } = err;
    res.status(status).render('error.ejs', { message });
    next(err);
});

app.listen(port, () => {
    console.log(`your app is listening on http://localhost:${port}/home`);
});
