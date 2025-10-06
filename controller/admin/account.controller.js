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
            deleted: false,
            _id: {
                $ne: req.params.id
            }
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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const account = await Account.findOne({
            _id: req.params.id,
            deleted: false
        })

        const roles = await Role.find({
            deleted: false
        });

        res.render("admin/pages/accounts/edit.pug", {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account,
            roles: roles
        })
    } catch (error) {
        console.log(error);

    }

}

// [PATCH] /admin/accounts/edit/:id
module.exports.editItemPatch = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false,
            _id: { $ne: req.params.id }
        });

        if (emailExist) {
            req.flash('error', 'Email đã tồn tại!');
            res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${req.params.id}`);
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }
            await Account.updateOne({
                _id: req.params.id
            }, req.body);
            req.flash('success', `Cập nhật tài khoản thành công`);
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        console.log(error);
        req.flash('error', `Cập nhật tài khoản thất bại`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${req.params.id}`);
    }
};