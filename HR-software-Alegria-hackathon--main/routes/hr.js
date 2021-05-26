const express = require("express")
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const hr = require("../controllers/hr")



router.route('/:id/home')
    .get((req,res)=>{
    res.render('examples/dashboard');})

router.route('/:id/addJobOpp')
    .get((req,res)=>{
        res.render('hr/deptman')
    })
    .post(catchAsync(hr.addJob))

router.route('/:id1/viewAppl/:id2')
    .get(catchAsync(hr.viewAppl))

router.route('/:id1/showAppli/:id2/:id3')
    .get(catchAsync(hr.showAppli))
    .delete(catchAsync(hr.rejectCand))

router.route('/:id1/acceptCand/:id2/:id3')
    .get(catchAsync(hr.sendMail))

router.route('/:id1/acceptCandFinal/:id2/:id3')
    .get(catchAsync(hr.accept))

module.exports = router;