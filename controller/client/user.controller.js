const User = require("../../models/user.modal");
const md5 = require("md5");

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