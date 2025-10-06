const express = require("express");
const multer = require('multer');

const router = express.Router();

const upload = multer();

const controller = require("../../controller/admin/account.controller");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', upload.single('avatar'),
    cloudUpload.upload,
    controller.createItemPost
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',  upload.single('avatar'), cloudUpload.upload, controller.editItemPatch);

module.exports = router