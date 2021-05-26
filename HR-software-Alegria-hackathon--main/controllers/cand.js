const User = require("../models/user");
const Job = require('../models/job');
const mongoose= require("mongoose")
var ObjectId = require('mongodb').ObjectID;

module.exports.renderHome = (req,res)=> {
    res.render('candidate/home');
}

module.exports.renderLogin = (req, res) => {
    res.render('login')
}

module.exports.loadHome =async(req,res)=>{
    const user = await User.findById(req.user._id)
    const jobs=[]
    if(user.applied.length!=0){
        const array=user.applied
        for (let i = 0; i < array.length; i++) { 
            const j= await Job.findById(new ObjectId(array[i].id))
            job1={
                j,
                status: array[i].status,
                feedback: array[i].feedback
            }
            jobs.push(job1)
        } 
    }
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(jobs)
    res.render('examples/dashboard',{jobs})
}

module.exports.registerUser = async (req, res, next) => {
    try {
        var {type="candidate",email ,username , password } = req.body;
        const user = new User({type,email,username });
        //console.log("BLABLA")
        const regUser = await User.register(user, password);
        req.login(regUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome!')
            res.redirect(`/candidate/${user._id}/home`);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/login')
    }
}

module.exports.editDetails = async(req,res)=>{
        const user = await User.findById(req.user._id)
        const {name,
        dateOfBirth,
        uniname,
        deg,
        spe,
        colgname,
        boa,
        twdate,
        addr,
        city,
        state,
        zip,
        phone} =req.body.Cand
        user.name=name
        user.dateOfBirth=dateOfBirth
        user.uniname=uniname
        user.deg=deg
        user.spe=spe
        user.colgname=colgname
        user.boa=boa
        user.twdate=twdate
        user.addr=addr
        user.city=city
        user.state=state
        user.zip=zip
        user.phone=phone
        console.log(user)
        await user.save()
        
        req.flash('success',"Successfully updated");
        res.redirect(`/candidate/${req.user._id}/home`)
}

module.exports.viewJobs = async(req,res)=>{
    const jobs = await Job.find();
    console.log(jobs)
    res.render('examples/jobopp', { jobs });
}

module.exports.showJob = async(req,res)=>{
    const {id1,id2}=req.params
    const job = await Job.findById(id2).populate({path: 'applicants', match: {email: req.user.email}});
    console.log(job)
    res.render('candidate/showjob',{job})
}

module.exports.applyJob = async(req,res)=>{
    for(let jobid in req.body)
    {
        const job= await Job.findById(jobid);
        status='applied'
        console.log(job)
        job.applicants.push(req.user._id)
        await job.save()
        console.log(job)
        const user=await User.findById(req.user._id)
        appl={
            id: jobid,
            status: 'applied'
        }
        user.applied.push(appl)
        await user.save()
        res.redirect(`/candidate/${user._id}/home`)
    }
}

module.exports.decline = async(req,res)=>{
    const {id1,id2}=req.params
    const user = await User.findById(id1)
    console.log(user)
    user.isaccepted=0;
    const job = await Job.findById(id2).populate({path: 'applicants'});
    job.vacancies=job.vacancies+1
    if(user.applied.length!=0){
        const array=user.applied
        for (let i = 0; i < array.length; i++) { 
            const j= await Job.findById(new ObjectId(array[i].id))
            if(j)
            {
                if(job._id==j._id)
                {
                    array[i].status="rejected"
                    array[i].feedback="declined by candidate"
                }
            }
            
        } 
    }
    
    await job.save()
    await user.save()
    await Job.findByIdAndUpdate(id2, {$pull: {applicants: id1}})
    res.redirect(`/candidate/${req.user._id}/home`)
}

module.exports.renderKyc=(req,res)=>{
    res.render('examples/kycform')
}

module.exports.renderCv= (req,res)=>{
    res.render('examples/cvupload')
}

module.exports.viewDetails =async(req,res)=>{
    res.render('candidate/details')
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/candidate/';
    req.flash('success', `Welcome Back ${req.user.username}`);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Ok bye!');
    res.redirect('/');
}