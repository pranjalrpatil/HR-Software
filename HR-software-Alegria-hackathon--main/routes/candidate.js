const express = require("express")
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const cand = require("../controllers/cand")

router.route('/register')
    .post(catchAsync(cand.registerUser))
    .put(catchAsync(cand.editDetails))

router.route('/:id/home')
    .get(catchAsync(cand.loadHome))
    .post((req,res)=>{
        res.render('candidate/details')
    })
    .put(catchAsync(cand.editCand))

router.route('/:id/viewJobOpp')
    .get(catchAsync(cand.viewJobs))
    .post(catchAsync(cand.applyJob))

router.route('/:id1/showJob/:id2')
    .get(catchAsync(cand.showJob))

router.route('/:id/ViewpersonalDetails')
    .get(catchAsync(cand.viewDetails))

router.route('/:id/updateCv')
    .get(cand.renderCv)
    .post((req,res)=>{
        if(req.files){
            console.log(req.files)
            var file= req.files.file
            var filename= `${req.user._id}`+'.pdf'
            file.mv('./uploads/'+filename,(err)=>{
                if(err){
                    res.send(err)
                }else{
                    res.redirect(`/candidate/${req.user._id}/home`)
                }
            })
        }
    })

router.route('/:id1/decline/:id2')
    .get(catchAsync(cand.decline))

router.route('/:id/kyc')
    .get(cand.renderKyc)
    .post((req,res)=>{
        if(req.files){
            console.log(req.files)
            // var file= req.files.file
            // var filename= `${req.user._id}`+'.pdf'
            // file.mv('./uploads/'+filename,(err)=>{
            //     if(err){
            //         res.send(err)
            //     }else{
            //         res.redirect(`/candidate/${req.user._id}/home`)
            //     }
            // })
        }
    })
    

module.exports = router;