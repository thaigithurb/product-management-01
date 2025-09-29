const systemConfig = require("../../config/system");

module.exports.createItemPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', `Vui lòng nhập tiêu đề ít nhất 8 ký tự!`);
        res.redirect(`${systemConfig.prefixAdmin}/products-cateogry/create`);
        return;
    }

    next();
}

module.exports.editItemPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', `Vui lòng nhập tiêu đề ít nhất 8 ký tự!`);
        res.redirect(`${systemConfig.prefixAdmin}/products-cateogry/edit/${req.params.id}`);
        return;
    }

    next();
}