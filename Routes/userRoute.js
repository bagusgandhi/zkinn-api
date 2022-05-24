const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.allow('admin'), userController.getAllUsers)
  .post(authController.protect, authController.allow('admin'), userController.createUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, authController.allow('admin'), userController.deleteUser);

module.exports = router;
