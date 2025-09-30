module.exports.createItemPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', `Vui lòng nhập tiêu đề!`);
        res.redirect(`${systemConfig.prefixAdmin}/roles/create`);
        return;
    }

    next();
}

