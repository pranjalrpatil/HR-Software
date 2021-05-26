const express = require("express")
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const admins = require("../controllers/admin")

router.route('/:id/home')
    .get(admins.renderHome)

router.route('/register')
    .get(admins.renderRegister)
    .post(catchAsync(admins.register))

router.route('/login')
    .get(admins.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin/' }), admins.login)

router.route('/adduser')
    .get(admins.renderAdduser)
    .post(catchAsync(admins.registerUser))

router.get('/logout', admins.logout)

module.exports = router;