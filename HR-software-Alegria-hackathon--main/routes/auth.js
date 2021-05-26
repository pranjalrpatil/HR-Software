const express = require("express")
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const users = require("../controllers/auth");
const ExpressError = require("../utils/expressError");
const ResumeParser = require('resume-parser');

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)



router.route('/resume')
    .get((req,res)=>{
        ResumeParser
        .parseResumeFile('./uploads/CV_JAIJOSHI.doc', './uploads/') // input file, output dir
        .then(file => {
            console.log("Yay! " + file);
        })
        .catch(error => {
            console.error(error);
        })
    })
router.get('/logout', users.logout)

module.exports = router;