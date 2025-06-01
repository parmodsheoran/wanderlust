if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const WrapAsync = require("./Utils/WrapAsync.js");
const { render } = require("ejs");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const { parseArgs } = require("util");

// const MONGO_URl = "mongodb://127.0.0.1:27017/Wanderlust";

const MONGO_URl = process.env.ATLASDB_URL;
// Response from DataBase
main().then(() => {
    console.log("Connected to DataBase");
})
    .catch((err) => {
        console.log(err);
    })

// Connect to DB
async function main() {
    mongoose.connect(MONGO_URl);
}

// Set EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: MONGO_URl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
   console.log("Error occured in Mongo Session store",err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


//MiddleWare
app.use((req, res, next) => {
    if (req.body.listing) {
        if (req.body.listing['image.url'] !== undefined) {
            req.body.listing.image = { url: req.body.listing['image.url'] };
            delete req.body.listing['image.url'];
        }
    }
    next();
});

app.use(session(sessionOption));
app.use(flash());

// Passport MiddelWare
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.msg = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})


// listing Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Error Handling for bad request
app.all("*", (req, res, next) => {
    next(new ExpressError(400, "Page not found!"));
})

// Error Handling
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.render("listings/error.ejs", { err });
    // res.send("Something went wrong");
})

// Listening port
app.listen(8080, () => {
    console.log("Server is listening port 8080");
})
