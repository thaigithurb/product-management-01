const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductsCategory = require("../../models/products-category.model");
const Products = require("../../models/products.model");
const productHelper = require("../../helpers/product");


// [GET] / 
module.exports.index = async (req, res) => {

    const featuredProducts = await Products.find({
        status: "active",
        deleted: false,
        featured: "1"
    }).sort({
        position: "asc"
    }).limit(4);

    const newProducts = productHelper.productNewPrice(featuredProducts);

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        products: newProducts
    })
}