const Products = require("../../models/products.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    const search = searchHelper(req.query);

    const status = req.query.status;

    let find = {
        deleted: false,
    }

    if (status) {
        find.status = status;
    }

    if (search.re) {
        find.title = search.re;
    }

    // pagination 
    const countProducts = await Products.countDocuments(find);


    const objectPagination = paginationHelper({
        limitItems: 4,
        currentPage: 1,
    }, req.query, countProducts)

    // sort 
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } 
    else {
        sort.position = "desc"
    }
    // end sort 

    const currentSort = req.query.sortKey && req.query.sortValue ? `${req.query.sortKey}-${req.query.sortValue}` : "";


    // end pagination 

    const products = await Products.find(find).limit(objectPagination.limitItems).skip(objectPagination.offset).sort(sort);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: search.keyword,
        totalPages: objectPagination.totalPages,
        currentPage: objectPagination.currentPage,
        currentUrl: req.originalUrl,
        currentSort: currentSort 
    })
}

// [PATCH] /admin/products/change-status/:status/:id 
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;

    await Products.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    const redirectUrl = req.query.redirect || `${systemConfig.prefixAdmin}/products`;
    res.redirect(redirectUrl);

};

// [PATCH] /admin/products/change-multi 
module.exports.multiChange = async (req, res) => {

    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Products.updateMany({ _id: { $in: ids } }, { status: 'active' });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Products.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Products.updateMany({ _id: { $in: ids } }, { deleted: 'true', deletedAt: new Date() });
            break;
        case "position-change":
            for (const item of ids) {

                let [id, position] = item.split("-");

                position = parseInt(position);

                await Products.updateOne({ _id: id }, { position: position });

            }
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }

    const redirectUrl = req.query.redirect || `${systemConfig.prefixAdmin}/products`;
    res.redirect(redirectUrl);

};

// [DELETE] /admin/products/delete/:id
module.exports.itemDelete = async (req, res) => {

    const id = req.params.id;

    await Products.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    req.flash('success', `Đã xóa thành công sản phẩm!`);

    const redirectUrl = req.query.redirect || `${systemConfig.prefixAdmin}/products`;
    res.redirect(redirectUrl);

};

// [GET] /admin/products/create
module.exports.createItem = async (req, res) => {

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });

};

// [POST] /admin/products/create
module.exports.createItemPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "0") {
        const countProducts = await Products.countDocuments({ deleted: false });
        req.body.position = parseInt(countProducts) + 1;
    }

    const newProduct = new Products(req.body);

    await newProduct.save();

    req.flash('success', `Đã tạo thành công sản phẩm mới!`);

    res.redirect(`${systemConfig.prefixAdmin}/products`);

};

// [GET] /admin/products/edit/:id
module.exports.editItem = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Products.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        req.flash('error', `Cập nhật sản phẩm thất bại`);
        res.redirect(`${systemConfig.prefixAdmin}/products/`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editItemPatch = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Products.updateOne({ _id: req.params.id }, req.body);
        req.flash('success', `Cập nhật sản phẩm thành công!`);
    } catch (error) {
        req.flash('success', `Cập nhật sản phẩm thất bại`);
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/detail/:id
module.exports.itemDetail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Products.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        // req.flash('error', `Cập nhật sản phẩm thất bại`);
        res.redirect(`${systemConfig.prefixAdmin}/products/`);
    }

};

