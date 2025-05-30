const User = require("../models/user");

module.exports.renderSignup=(req, res) => {
    res.render('users/signup.ejs');
};


module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs");
};


module.exports.Login=async (req, res) => {
    req.flash("success", "Welcome Back, You are logged in !!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged Out, Dear !!");
        res.redirect("/listings");
    })
};

