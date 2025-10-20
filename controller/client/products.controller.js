const Products = require("../../models/products.model");
const productHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/products-category");
const ProductsCategory = require("../../models/products-category.model");

// [GET] /admin/products/:slug
module.exports.index = async (req, res) => {

    const products = await Products.find({
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    });

    const newProducts = productHelper.productNewPrice(products);


    res.render("client/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    })
}

// [GET] /admin/products/:slugCategory
module.exports.category = async (req, res) => {

    const category = await ProductsCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false
    });


    const subsListCategory = await productsCategoryHelper.getSubCategory(category.id);

    const subsListCategoryId = subsListCategory.map(item => {
        return item.id
    })

    const products = await Products.find({
        product_category_id: {
            $in: [category.id, ...subsListCategoryId]
        },
        deleted: false
    }).sort({
        position: "desc"
    });


    const newProducts = productHelper.productNewPrice(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: category.title,
        products: newProducts
    })
};

// [GET] /admin/products/:slug
module.exports.itemDetail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };

        const product = await Products.findOne(find);

        const productCategory = await ProductsCategory.findOne({
            _id: product.product_category_id,
            deleted: false,
            status: "active"
        });

        product.category = productCategory;

        const newProduct = productHelper.detailProductNewPrice(product);

        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: newProduct
        });
    } catch (error) {

        console.log('Error in itemDetail:', error);

        res.redirect(`/products`);
    }
};