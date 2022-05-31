const express = require('express');
const scheduleController = require('../Controllers/scheduleController');
const authDoctorController = require('../Controllers/authDoctorController');
const doctorController = require('../Controllers/doctorController');

const router = express.Router();

router.get('/', authDoctorController.protect, authDoctorController.allow('admin'), doctorController.getAllDoctors);

router.get('/:doctor_id', authDoctorController.protect, doctorController.getDoctor);

router.post('/:doctor_id/schedule/:user_id', authDoctorController.protect, scheduleController.createSchedule);

module.exports = router;
