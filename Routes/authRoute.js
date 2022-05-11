const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router
  .route('/login')
  .post(authController.login);

router
  .route('/register')
  .post(authController.register);

module.exports = router;
