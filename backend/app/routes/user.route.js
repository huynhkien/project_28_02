const UserController = require('../controllers/user.controller');
const express = require('express');

const router = express.Router();

router.route('/uid').get(UserController.getUser);
router.route('/register').post(UserController.register);
router.route('/login').post(UserController.login);
router.route('/forgot-password').post(UserController.forgotPassword);
router.route('/reset-password').post(UserController.resetPassword);

module.exports = router;

