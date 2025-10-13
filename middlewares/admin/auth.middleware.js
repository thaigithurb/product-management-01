const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        console.log("ok");
        const user = await Account.findOne({
            token: req.cookies.token,
            deleted: false
        })
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
        else {
            next();
        }
    }
}