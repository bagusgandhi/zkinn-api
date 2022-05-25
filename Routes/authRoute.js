const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router
  .route('/register')
  .post(authController.register);

router
  .route('/login')
  .post(authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.post('/resetPassword', authController.resetPassword);

module.exports = router;
