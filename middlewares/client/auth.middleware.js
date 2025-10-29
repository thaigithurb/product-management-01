const User = require("../../models/user.modal");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect(`/auth/login`);
    } else {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
        }).select("-password");
        if (!user) {
            res.redirect(`/auth/login`);
        }
        else {
            res.locals.user = user;
            next();
        }
    }
}