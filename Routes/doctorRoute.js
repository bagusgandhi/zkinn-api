const express = require('express');
const scheduleController = require('../Controllers/scheduleController');
const authDoctorController = require('../Controllers/authDoctorController');
const doctorController = require('../Controllers/doctorController');
const patientController = require('../Controllers/patientController');

const router = express.Router();

router.get('/', authDoctorController.protect, authDoctorController.allow('admin'), doctorController.getAllDoctors);

router.get('/:doctor_id', authDoctorController.protect, doctorController.getDoctor);

router.get('/:doctor_id/schedule', authDoctorController.protect, scheduleController.getAllSchedule);

router.post('/:doctor_id/schedule/:user_id', authDoctorController.protect, scheduleController.createSchedule);

router.get('/:doctor_id/schedule/:user_id', authDoctorController.protect, scheduleController.getScheduleByUser);

router.delete('/:doctor_id/schedule/:schedule_id', authDoctorController.protect, scheduleController.deleteSchedule);

router.get('/:doctor_id/schedule/:schedule_id/items/:items_id', authDoctorController.protect, scheduleController.getItems);

router.patch('/:doctor_id/schedule/:schedule_id/items/:items_id', authDoctorController.protect, scheduleController.updateSchedule);

router.get('/:doctor_id/patient', authDoctorController.protect, patientController.getAllpatient);

router.get('/:doctor_id/patient/:patient_id', authDoctorController.protect, patientController.getPatientDetail);

module.exports = router;
