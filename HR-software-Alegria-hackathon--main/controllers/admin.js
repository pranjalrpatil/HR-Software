const User = require("../models/user");

module.exports.renderHome = (req,res)=> {
    res.render('admin/home');
}

module.exports.renderRegister = (req, res) => {
    res.render("admin/register");
}

module.exports.register = async (req, res, next) => {
    try {
        const {type="admin",email ,username , password } = req.body;
        const user = new User({type,email,username });
        const regUser = await User.register(user, password);
        req.login(regUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect("/admin/");
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/admin/register')
    }
}

module.exports.registerUser = async (req,res)=>{
    try {
        var { type, email ,username="aa", password } = req.body;
        console.log(req.body)
        const user = new User({ type,email,username});
        console.log(user)
        const regUser = await User.register(user, password);
        req.login(regUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome!')
            res.redirect(`/${regUser._id}/admin/`);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/admin/adduser')
    }
}

module.exports.renderAdduser = (req,res)=> {
    res.render('admin/adduser');
}

module.exports.renderLogin = (req, res) => {
    res.render('login')
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