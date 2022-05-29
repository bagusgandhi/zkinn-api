const express = require('express');
const authDoctorController = require('../Controllers/authDoctorController');

const router = express.Router();

router.post('/register', authDoctorController.register);

router.post('/login', authDoctorController.login);

router.post('/forgotPassword', authDoctorController.forgotPassword);

router.patch('/resetPassword/:token', authDoctorController.resetPassword);

router.patch('/updatePassword/:id', authDoctorController.protect, authDoctorController.updatePassword);

module.exports = router;
