// if(process.env.NODE_ENV !== "production"){
//     require("dotenv").config();
// }
//require("dotenv").config();

const express = require("express")
const app = express();
const path = require('path')
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const joi = require("joi")
const session= require("express-session")
const passport = require('passport')
const localStrategy =require("passport-local")
const flash = require("connect-flash");
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo').default;



const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/expressError");
//const { campgroundSchema, reviewSchema }= require("./schemas.js")
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const hrRoutes = require("./routes/hr");
const candRoutes = require("./routes/candidate");
const User = require("./models/user");

const upload=require("express-fileupload");

const dbUrl = 'mongodb://localhost:27017/pillai-hackathon';
mongoose.connect(dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("MONGOOSE CONNECTED")
});

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(upload())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash());
app.use(mongoSanitize({
    replaceWith: ' '
  }));

const secret = process.env.SECRET || "lolnoobsecret";
  
const store =  new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*3600
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR",e);
})

const sessionConfig = {
    store,
    name: 'sessionsecretid',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
} 
app.use(session(sessionConfig))



app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy({
    usernameField: 'email'
  }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/',userRoutes);
app.use('/admin', adminRoutes);
app.use('/hr', hrRoutes);
app.use('/candidate',candRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all("*", (req, res, next) => {
     next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
     if (!err.message) err.message = "something went wrong";
     res.status(statusCode).render("error", { err });
})

const port = 3000;
app.listen(port, () => {
    console.log(`serving on port ${port}`);
})