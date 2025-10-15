const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductsCategory = require("../../models/products-category.model");


// [GET] / 
module.exports.index = async (req, res) => {

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
    })
}