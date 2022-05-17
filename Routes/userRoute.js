const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
