const Products = require("../../models/products.model");
const Accounts = require("../../models/account.model");
const ProductsCategory = require("../../models/products-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const pagination = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

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
    } else {
        sort.position = "desc"
    }
    // end sort 

    const currentSort = req.query.sortKey && req.query.sortValue ? `${req.query.sortKey}-${req.query.sortValue}` : "";

    // end pagination 

    const products = await Products.find(find).limit(objectPagination.limitItems).skip(objectPagination.offset).sort(sort);

    for (const product of products) {

        // lấy ra thônng tin người tạo 
        const user = await Accounts.findOne({
            _id: product.createdBy.account_id
        });

        if (user) {
            product.account_fullName = user.fullName
        }

        // lấy ra thônng tin người cập nhật gần nhất
        const userUpdate = product.updatedBy[product.updatedBy.length - 1];

        if (userUpdate) {
            const userUpdated = await Accounts.findOne({
                _id: userUpdate.account_id
            });

            if (userUpdated) {
                product.account_fullName1 = userUpdated.fullName
            }
        }
    }



    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: search.keyword,
        totalPages: objectPagination.totalPages,
        currentPage: objectPagination.currentPage,
        currentUrl: req.originalUrl,
        currentSort: currentSort,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id 
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }


    await Products.updateOne({
        _id: id
    }, {
        status: status,
        $push: {
            updatedBy: updatedBy
        }
    });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    const redirectUrl = req.query.redirect || `${systemConfig.prefixAdmin}/products`;
    res.redirect(redirectUrl);

};

// [PATCH] /admin/products/change-multi 
module.exports.multiChange = async (req, res) => {

    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Products.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: 'active',
                $push: {
                    updatedBy: updatedBy
                }
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Products.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: 'inactive',
                $push: {
                    updatedBy: updatedBy
                }
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Products.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: 'true',
                deletedAt: new Date()
            });
            break;
        case "position-change":
            for (const item of ids) {

                let [id, position] = item.split("-");

                position = parseInt(position);

                await Products.updateOne({
                    _id: id
                }, {
                    position: position,
                    $push: {
                        updatedBy: updatedBy
                    }
                });

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

    await Products.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }
    });

    req.flash('success', `Đã xóa thành công sản phẩm!`);

    const redirectUrl = req.query.redirect || `${systemConfig.prefixAdmin}/products`;
    res.redirect(redirectUrl);

};

// [GET] /admin/products/create
module.exports.createItem = async (req, res) => {

    const category = await ProductsCategory.find({
        deleted: false
    });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });

};

// [POST] /admin/products/create
module.exports.createItemPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "0") {
        const countProducts = await Products.countDocuments({
            deleted: false
        });
        req.body.position = parseInt(countProducts) + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    };

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

        const category = await ProductsCategory.find({
            deleted: false
        });

        const newCategory = createTreeHelper.tree(category);

        const product = await Products.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
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

    try {

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Products.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            $push: {
                updatedBy: updatedBy
            }
        });


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
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products/`);
    }

};