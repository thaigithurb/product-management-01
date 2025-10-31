const express = require("express");
const multer = require('multer');

const router = express.Router();

const upload = multer();

const controller = require("../../controller/admin/settings.controller");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get('/general', upload.single('logo'), cloudUpload.upload, controller.general);

router.patch('/general', upload.single('logo'), cloudUpload.upload, controller.generalPatch);

module.exports = router