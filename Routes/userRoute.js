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
  .patch(authController.protect, authController.allow('admin'), userController.updateUser)
  .delete(authController.protect, authController.allow('admin'), userController.deleteUser);

router.patch('/update/:id', authController.protect, userController.update);

router.get('/:id/findDoctor', authController.protect, userController.findDoctor);

module.exports = router;
