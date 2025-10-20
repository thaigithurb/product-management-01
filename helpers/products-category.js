const ProductsCategory = require("../models/products-category.model");


module.exports.getSubCategory = async (parent_id) => {

    const getCategory = async (parent_id) => {
        const subs = await ProductsCategory.find({
            parent_id: parent_id,
            status: "active",
            deleted: false
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const children = await getCategory(sub.id);
            allSub = allSub.concat(children);
        }

        return allSub;
    }

    const result = await getCategory(parent_id);
    return result;
}