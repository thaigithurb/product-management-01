const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductsCategory = require("../../models/products-category.model");
const Products = require("../../models/products.model");
const productHelper = require("../../helpers/product");


// [GET] / 
module.exports.index = async (req, res) => {

    // Hiển thị sản phẩm nổi bật 
    const featuredProducts = await Products.find({
        status: "active",
        deleted: false,
        featured: "1"
    }).limit(4);

    const records = productHelper.productNewPrice(featuredProducts);
    // Hiển thị sản phẩm nổi bật

    // hiển thị sản phẩm mới nhất
     const newProducts = await Products.find({
        status: "active",
        deleted: false,
    }).sort({
        position: "desc"
    }).limit(8);

     const records1 = productHelper.productNewPrice(newProducts);
    // hiển thị sản phẩm mới nhất

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        featuredProducts: records,
        newProducts: records1,
    })
}