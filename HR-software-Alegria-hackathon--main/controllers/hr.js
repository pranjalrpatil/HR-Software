const User = require("../models/user");
const Job = require('../models/job')
var nodemailer = require('nodemailer');

module.exports.renderHome = (req,res)=> {
    res.render('hr/home');
}

module.exports.renderLogin = (req, res) => {
    res.render('login')
}

module.exports.addJob =async (req,res)=>{
    console.log(req.body.Job)
    const newJob = new Job(req.body.Job);
    newJob.author=req.user._id;
    await newJob.save();
    req.flash('success','Posted a job successfully!')
    res.redirect(`/hr/${req.user._id}/home`)
}

module.exports.viewAppl= async(req,res)=>{
    const{id1,id2}=req.params
    const jobs = await Job.findById(id2).populate({path: 'applicants'});
    res.render('hr/viewAppl',{jobs});
}

module.exports.showAppli = async(req,res)=>{
    const{id1,id2,id3}=req.params
    const appl=await User.findById(id3)
    const job = await Job.findById(id2).populate({path: 'applicants'});
    console.log(appl)
    res.render('examples/showAppli',{appl,job})
}

module.exports.rejectCand =async (req,res)=>{
    const{id1,id2,id3}=req.params
    const appl=await User.findById(id3)
    const job = await Job.findById(id2).populate({path: 'applicants'});
    const arr=appl.applied
    for(let i=0;i<appl.applied.length;i++)
    {
        if(arr[i].id==job._id)
        {
            arr[i].status='rejected'
            arr[i].feedback='Poor performance'
        }
    }
    await appl.save()
    await Job.findByIdAndUpdate(id2, {$pull: {applicants: id3}})
    res.redirect(`/hr/${id1}/viewAppl/${id2}`)
}

module.exports.sendMail =async(req,res)=>{
    console.log("###########################################")
    const{id1,id2,id3}=req.params
    const appl=await User.findById(id3)
     var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'jaijoshi0310@gmail.com',
           pass: 'jai#123*'
         }
       });
      
       var mailOptions = {
         from: 'jai.joshi@spit.ac.in',
         to: appl.email,
        subject: 'INTERVIEW SCHEDULED',
         text: `Hello ${appl.name} your interview is scheduled at 7:00 PM IST`
      };
      
       transporter.sendMail(mailOptions, function(error, info){
         if (error) {
           console.log(error);
         } else {
          console.log('Email sent: ' + info.response);
         }
       });
      const job = await Job.findById(id2).populate({path: 'applicants'});
      const arr=appl.applied
      for(let i=0;i<appl.applied.length;i++)
      {
          if(arr[i].id==job._id)
          {
              arr[i].status='interview'
          }
      }
      await appl.save()
      console.log("########################################")
      res.redirect(`/hr/${id1}/viewAppl/${id2}`)
}

module.exports.accept =async(req,res)=>{
    console.log("###########################################")
    const{id1,id2,id3}=req.params
    const appl=await User.findById(id3)
     var transporter = nodemailer.createTransport({
         service: 'gmail',
       auth: {
          user: 'jaijoshi0310@gmail.com',
       pass: 'jai#123*'
     }
      });
      
      var mailOptions = {
        from: 'jai.joshi@spit.ac.in',
        to: appl.email,
         subject: 'INTERVIEW SCHEDULED',
        text: `Hello ${appl.name} your interview is scheduled at 7:00 PM IST`
       };
      
       transporter.sendMail(mailOptions, function(error, info){
         if (error) {
          console.log(error);
        } else {
         console.log('Email sent: ' + info.response);
         }
      });
      const job = await Job.findById(id2).populate({path: 'applicants'});
      const arr=appl.applied
      for(let i=0;i<appl.applied.length;i++)
      {
          if(arr[i])
          {
            if(arr[i].id==job._id)
            {
                arr[i].status='accepted'
                arr[i].feedback='Amazing skillset, average communication skills'
            }
          }
          
      }
      job.vacancies=job.vacancies-1
      appl.isaccepted=1;
      await job.save()
      await appl.save()
      console.log("########################################")
      res.redirect(`/candidate/${id1}/viewJobOpp`)
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/admin/';
    req.flash('success', `Welcome Back ${req.user.username}`);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Ok bye!');
    res.redirect('/');
}