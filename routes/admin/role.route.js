const express = require("express");

const router = express.Router();

const controller = require("../../controller/admin/role.controller");

const validate = require("../../validates/admin/roles.validate");

router.get('/', controller.index);

router.get('/create', controller.createRole);

router.post('/create',
    validate.createItemPost,
    controller.createItemPost
);

router.get('/edit/:id', controller.editItem);

router.patch('/edit/:id', 
    validate.createItemPost,
    controller.editItemPatch
);

router.get('/permissions', controller.permissions);

router.patch('/permissions', controller.permissionsPatch);



module.exports = router