const Doctor = require('../Models/doctorModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');
const Schedule = require('../Models/scheduleModel');
const User = require('../Models/userModel');
const Disease = require('../Models/diseaseModel');

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.find();
  const { _id, username, email } = doctor;

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    data: [
      _id,
      username,
      email,
    ],
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.doctor_id);

  if (!doctor) {
    return next(
      new AppError('no doctor found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    doctor: {
      doctor,
    },
  });
});

exports.updateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.doctor_id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return next(
      new AppError('no doctor found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    doctor: {
      doctor,
    },
  });
});

exports.endConsult = catchAsync(async (req, res, next) => {
  const removePatient = await Doctor.updateOne(
    {
      _id: req.params.doctor_id,
    },
    {
      $pull: {
        patients: req.body.patient_id,
      },
    },
  );

  const removeSchedule = await Schedule.findOneAndRemove(
    {
      users: req.params.user_id,
      doctors: req.params.doctor_id,
    },
  );

  const removeStatusUser = await User.updateOne(
    { _id: req.params.user_id },
    {
      $unset: {
        'handled_by.doctor_id': '',
        'handled_by.doctor_name': '',
      },
    },

  );

  const removeDiseaseDoctor = await Disease.findOneAndRemove(
    {
      users: req.params.user_id,
      doctors: req.params.doctor_id,
    },
  );

  if (!removePatient && !removeSchedule && !removeStatusUser && !removeDiseaseDoctor) {
    return next(
      new AppError('no doctor_id, user_id, or disease_id  found with the IDs', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    message: 'Ended Consultation Succesfull!',
  });
});
