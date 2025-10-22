const Products = require("../../models/products.model");
const productHelper = require("../../helpers/product");


// [GET] /search
module.exports.index = async (req, res) => {

    const keyword = req.query.keyword;

    let searchedProducts = [];

    if (keyword) {
        const regex = new RegExp(keyword, 'i');
        const products = await Products.find({
            title: regex,
            deleted: false,
            status: "active"
        });

        searchedProducts = productHelper.productNewPrice(products);
    }

    else {
        res.redirect(`/products`);
        return;
    }

    res.render("client/pages/search/index.pug", {
        pageTitle: "kết quả tìm kiếm",
        keyword: keyword,
        searchedProducts: searchedProducts
    })
}