const Products = require("../../models/products.model");

module.exports.index = async (req, res) => {

    const products = await Products.find(
        {
            status: "active",
            deleted: false
        }
    ).sort({ position: "asc" });

    res.render("client/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products
    })
}

// [GET] /admin/products/:slug
module.exports.itemDetail = async (req, res) => {

     try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };

        const product = await Products.findOne(find);

        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
 
        console.log('Error in itemDetail:', error);  

        res.redirect(`/products`);
    }
};