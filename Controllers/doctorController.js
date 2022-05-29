const Doctor = require('../Models/doctorModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');

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
