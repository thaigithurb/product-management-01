const express = require("express");

const multer = require('multer');

const upload = multer();

const router = express.Router();

const controller = require("../../controller/admin/products-category.controller");

const validate = require("../../validates/admin/products-category.validate");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get('/', controller.index);

router.get('/create', controller.createItem);

router.post('/create', upload.single('thumbnail'),
    cloudUpload.upload,
    validate.createItemPost,
    controller.createItemPost
);

router.get('/edit/:id', controller.editItem);

router.patch('/edit/:id', upload.single('thumbnail'),
    cloudUpload.upload,
    validate.editItemPost,
    controller.editItemPatch
);

module.exports = router