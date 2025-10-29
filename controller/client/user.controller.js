const User = require("../../models/user.modal");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateOtpHelper = require("../../helpers/generate-otp");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");

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

    const cart = await Cart.findOne({
        user_id: user.id
    });

    if (cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId,
        }, {
            user_id: user.id
        });
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

    // nếu tồn tại email thì gửi otp 
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu là: <b style="color: green;" >${obJectForgotPassword.otp}</b>. Thời hạn sử dụng là 3 phút
    `;

    sendMailHelper.sendMail(email, subject, html);

    // Nếu tồn tại thì gửi mã OTP 

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/forgot
module.exports.otpPassword = async (req, res) => {

    const email = req.query.email;

    res.render("client/pages/user/otp-password.pug", {
        pageTitle: "Nhập mã OTP",
        email: email,
    })
}

// [POST] /user/password/forgot
module.exports.otpPasswordPost = async (req, res) => {

    const email = req.body.email;
    const otp = req.body.otp;

    const obJectForgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });

    if (!obJectForgotPassword) {
        req.flash("error", "Mã OTP không hợp lệ");
        res.redirect("user/password/otp");
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");


}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Đổi mật khẩu",
    })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {

    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;

    if (newPassword !== confirmPassword) {
        req.flash("error", "Mật khẩu không trùng khớp!");
        res.redirect("/user/password/reset");
        return;
    }

    await User.updateOne({
        tokenUser: tokenUser,
    }, {
        password: md5(newPassword)
    })

    res.clearCookie('tokenUser');

    res.redirect("/user/login")

    res.send("ok");
}

// [GET] /user/info
module.exports.info = async (req, res) => {

    res.render("client/pages/user/info.pug", {
        pageTitle: "Thông tin tài khoản",
    })
}