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

module.exports = router