const express = require("express");
const multer = require('multer');

const router = express.Router();

const upload = multer();

const controller = require("../../controller/admin/products.controller");

const validate = require("../../validates/admin/product.validate");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/multi-change', controller.multiChange);

router.patch('/delete/:id', controller.itemDelete);

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

router.get('/detail/:id', controller.itemDetail);

module.exports = router