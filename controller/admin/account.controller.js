const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');
const Role = require("../../models/role.model");



// [GET] /admin/accounts
module.exports.index = async (req, res) => {

    const records = await Account.find().select("-password -token");

    for (const record of records) {
        if (record.role_id) {
            const role = await Role.findOne({
                _id: record.role_id,
                deleted: false
            });
            record.role = role;
        }
    }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {

    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles,
    })
}

// [POST] /admin/accounts/create/:id
module.exports.createItemPost = async (req, res) => {

    try {

        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash('error', 'Email đã tồn tại!');
            res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
        } else {
            req.body.password = md5(req.body.password);

            const record = new Account(req.body);
            await record.save();

            req.flash('success', 'Tạo mới tài khoản thành công');
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }

    } catch (error) {
        console.error(error);

        req.flash('error', 'Tạo mới tài khoản thất bại!');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);

    }

}