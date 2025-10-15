const express = require("express");
const multer = require('multer');

const router = express.Router();

const controller = require("../../controller/admin/my-account.controller");
const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

const upload = multer();

router.get('/', controller.index);

router.get('/edit', controller.editItem);


router.patch('/edit', upload.single('avatar'),
    cloudUpload.upload,
    controller.editItemPatch
);

module.exports = router