const express = require('express');
const scheduleController = require('../Controllers/scheduleController');
const authDoctorController = require('../Controllers/authDoctorController');

const router = express.Router();

router.post('/:doctor_id/schedule/:user_id', authDoctorController.protect, scheduleController.createSchedule);

module.exports = router;
