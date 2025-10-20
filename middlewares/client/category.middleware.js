const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductsCategory = require("../../models/products-category.model");

module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false,
    }

    const productsCategory = await ProductsCategory.find(find);

    const newProductsCategory = createTreeHelper.tree(productsCategory);

    res.locals.layoutProductsCategory = newProductsCategory
    next();
}