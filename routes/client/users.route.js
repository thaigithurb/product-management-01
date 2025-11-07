const express = require("express");

const router = express.Router();

const controller = require("../../controller/client/users.controller");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get('/not-friend', authMiddleware.requireAuth, controller.notFriend);

router.get('/request', authMiddleware.requireAuth, controller.request);

router.get('/accept', authMiddleware.requireAuth, controller.accept);

module.exports = router;