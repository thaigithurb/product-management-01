const Account = require("../../models/account.model");
const ProductsCategory = require("../../models/products-category.model");
const Products = require("../../models/products.model");
const User = require("../../models/user.modal");

//[GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {

    const statistic = {
        productsCategory: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        products: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        accounts: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        users: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    statistic.productsCategory.total = await ProductsCategory.countDocuments({
        deleted: false,
    })
    statistic.productsCategory.active = await ProductsCategory.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.productsCategory.inactive = await ProductsCategory.countDocuments({
        deleted: false,
        status: "inactive"
    })
    statistic.products.total = await Products.countDocuments({
        deleted: false,
    })
    
    statistic.products.active = await Products.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.products.inactive = await Products.countDocuments({
        deleted: false,
        status: "inactive"
    })
    statistic.accounts.total = await Account.countDocuments({
        deleted: false,
    })
    statistic.accounts.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.accounts.inactive = await Account.countDocuments({
        deleted: false,
        status: "inactive"
    })

    statistic.users.total = await User.countDocuments({
        deleted: false,
    })
    statistic.users.active = await User.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.users.inactive = await User.countDocuments({
        deleted: false,
        status: "inactive"
    })

    res.render("admin/pages/dashboard/index.pug", {
        pageTitle: "Tổng quan",
        statistic: statistic
    })
}