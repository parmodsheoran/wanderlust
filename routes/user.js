const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware");
const userController = require("../controller/users");

router
    .route("/signup")
    .get(userController.renderSignup)
    .post(WrapAsync(userController.signup));


router
    .route("/login")
    .get(userController.renderLogin)
    .post(savedUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.Login);


router.get("/logout", userController.logout)

module.exports = router;