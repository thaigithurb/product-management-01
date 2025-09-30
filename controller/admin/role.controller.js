const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.createRole = async (req, res) => {

    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
    })
}

// [POST] /admin/roles/create
module.exports.createItemPost = async (req, res) => {

    console.log(req.body);

    const record = new Role(req.body);
    await record.save();

    req.flash('success', `Đã tạo thành công nhóm quyền mới!`);

    res.redirect(`${systemConfig.prefixAdmin}/roles`);

};

// [GET] /admin/roles/edit/:id
module.exports.editItem = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const record = await Role.findOne(find);

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        });
    } catch (error) {
        req.flash('error', `Cập nhật nhóm quyền thất bại`);
        res.redirect(`${systemConfig.prefixAdmin}/roles/`);
    }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editItemPatch = async (req, res) => {
    try {
        await Role.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash('success', `Cập nhật sản phẩm thành công!`);
    } catch (error) {
        req.flash('error', `Cập nhật sản phẩm thất bại`);
    }

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

