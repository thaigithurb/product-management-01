const User = require("../../models/user.modal");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateOtpHelper = require("../../helpers/generate-otp");

// [GET] /user/register
module.exports.register = async (req, res) => {

    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng ký",
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
    })

    if (existEmail) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("/user/register");
        return;
    } else {

        req.body.password = md5(req.body.password);

        const user = new User(req.body);
        await user.save();

        res.cookie("tokenUser", user.tokenUser);
        req.flash("success", "Đăng ký tài khoản thành công!");

        res.redirect("/");

    }

}

// [GET] /user/login
module.exports.login = async (req, res) => {

    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập",
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
        status: "active"
    });

    const password = req.body.password;

    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("/user/login");
        return;
    }

    if (md5(req.body.password) !== user.password) {
        req.flash("error", "Mật khẩu không chính xác!");
        res.redirect("/user/login");
        return;
    }

    if (user.active === "inactive") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("/user/login");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công!");

    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {

    res.clearCookie("tokenUser");
    res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Lấy lại mật khẩu",
    })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {

    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("/user/password/forgot");
        return;
    }

    // Lưu thông tin vào DB 
    const obJectForgotPassword = {
        email: email,
        otp: "",
        expiresAt: Date.now()
    };

    obJectForgotPassword.otp = generateOtpHelper.generateRandomString(6);

    const forgotPassword = new ForgotPassword(obJectForgotPassword);
    await forgotPassword.save();


    // Nếu tồn tại thì gửi mã OTP 

    res.send("ok");
}