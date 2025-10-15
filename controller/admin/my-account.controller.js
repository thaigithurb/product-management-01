const Accounts = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');


//[GET] /admin/my-account
module.exports.index = async (req, res) => {

    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Tài khoản của tôi"
    })
}



// [GET] /admin/my-account/edit
module.exports.editItem = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin",
    });
};


// [PATCH] /admin/my-account/edit
module.exports.editItemPatch = async (req, res) => {
    try {

        const id = res.locals.user.id;
        console.log(id);

        const emailExist = await Accounts.findOne({
            email: req.body.email,
            deleted: false,
            _id: {
                $ne: id
            }
        });

        if (emailExist) {
            req.flash('error', 'Email đã tồn tại!');
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
        } else {

            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password
            }

            await Accounts.updateOne({
                _id: id
            }, req.body);
            req.flash('success', `Cập nhật thông tin thành công!`);
            res.redirect(`${systemConfig.prefixAdmin}/my-account`);
        }
    } catch (error) {
        req.flash('error', `Cập nhật thông tin thất bại`);
        res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
    }
};