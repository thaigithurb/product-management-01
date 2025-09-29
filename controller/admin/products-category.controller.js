const ProductsCategory = require("../../models/products-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

//[GET] /admin/products-category
module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    }

    const records = await ProductsCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh sách sản phẩm",
        records: newRecords,
    })
}

//[GET] /admin/products-category/create
module.exports.createItem = async (req, res) => {

    let find = {
        deleted: false
    };

    const records = await ProductsCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/products/create
module.exports.createItemPost = async (req, res) => {

    if (req.body.position == "0") {
        const countProductsCategory = await ProductsCategory.countDocuments({
            deleted: false
        });
        req.body.position = parseInt(countProductsCategory) + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductsCategory(req.body);

    await record.save();

    req.flash('success', `Đã tạo thành công sản phẩm mới!`);

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);

};

//[GET] /admin/products-category/edit/:id
module.exports.editItem = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const record = await ProductsCategory.findOne(find);

        const records = await ProductsCategory.find({
            deleted: false
        });

        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: newRecords
        });

    } catch (error) {
        req.flash('error', `Cập nhật sản phẩm thất bại`);
        res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editItemPatch = async (req, res) => {

    try {
        const id = req.params.id;

        req.body.position = parseInt(req.body.position);

        await ProductsCategory.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash('success', `Cập nhật danh mục thành công!`);
    } catch (error) {
        req.flash('success', `Cập nhật danh mục thất bại`);
    }

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};