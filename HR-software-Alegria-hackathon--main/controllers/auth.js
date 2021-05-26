const User = require("../models/user");


module.exports.renderLogin = (req, res) => {
    res.render('home')
}

module.exports.login = (req, res) => {
    var redirectUrl = req.session.returnTo || '/home';
    req.flash('success', `Welcome Back ${req.user.username}`);
    delete req.session.returnTo;
    redirectUrl=`/${req.user.type}/${req.user._id}/home`
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Ok bye!');
    res.redirect('/');
}