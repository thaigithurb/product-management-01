const express = require("express");

const router = express.Router();

const controller = require("../../controller/client/products.controller");

router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

router.get('/detail/:slugProduct', controller.itemDetail);

module.exports = router;
