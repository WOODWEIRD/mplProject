exports.isAuthenticated = (req, res, next) => {
    if (req && req.session && req.session.isAuthenticated) {
        return next();
    } else {
        return res.redirect('/');
    }
};