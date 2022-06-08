const Doctor = require('../Models/doctorModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');
const User = require('../Models/userModel');
const Disease = require('../Models/diseaseModel');

// users
exports.addToPatient = catchAsync(async (req, res, next) => {
  const patient = await Doctor.updateOne(
    { _id: req.params.doctor_id },
    {
      $push: { patients: req.params.id },
    },
  );

  await Disease.updateOne(
    { _id: req.body.disease_id },
    {
      $set: {
        doctor: req.params.doctor_id,
      },
    },
  );

  const user = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        handled_by: {
          doctor_id: req.params.doctor_id,
          doctor_name: req.body.doctor_name,
        },
      },
    },
  );

  if (!patient && !user) {
    return next(
      new AppError('No doctor found with that ID', 404),
    );
  }

  res.status(201).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Patient Added Successfully',
  });
});

// doctors
exports.getAllpatient = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.doctor_id);
  const { patients } = doctor;

  const allPatient = await User.find({
    _id: {
      $in: patients,
    },
  });

  const data = allPatient.map((e) => ({
    _id: e._id,
    name: e.details.full_name,
    age: e.details.age,

  }));

  if (!doctor) {
    return next(
      new AppError('No doctor found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    data,
  });
});

// doctors
exports.getPatientDetail = catchAsync(async (req, res, next) => {
  const detailUser = await User.findById(req.params.patient_id);
  const { _id, details, disease } = detailUser;
  const detailDisease = await Disease.find(
    {
      $in: disease,
      doctor: req.params.doctor_id,
    },
  );

  if (!detailUser) {
    return next(
      new AppError('No patient found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    data: {
      _id,
      details,
      detailDisease,
    },
  });
});
