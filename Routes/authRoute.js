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

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updatePassword/:id', authController.protect, authController.updatePassword);

module.exports = router;
