const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');
const scheduleController = require('../Controllers/scheduleController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.allow('admin'), userController.getAllUsers)
  .post(authController.protect, authController.allow('admin'), userController.createUser);

router.get('/profile', authController.protect, userController.profile);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, authController.allow('admin'), userController.updateUser)
  .delete(authController.protect, authController.allow('admin'), userController.deleteUser);

router.patch('/update/:id', authController.protect, userController.update);

router.get('/:id/findDoctor', authController.protect, userController.findDoctor);

router.get('/:id/schedule', authController.protect, scheduleController.getSchedule);

router.get('/:id/schedule/:schedule_id', authController.protect, scheduleController.getScheduleById);

router.patch('/:id/schedule/:schedule_id/items/:items_id', authController.protect, scheduleController.doneTask);

module.exports = router;
