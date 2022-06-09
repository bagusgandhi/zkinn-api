const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../Models/userModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');
const Doctor = require('../Models/doctorModel');
const Schedule = require('../Models/scheduleModel');
const Disease = require('../Models/diseaseModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    data: [
      users,
    ],
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const {
    _id, username, email,
  } = user;

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    user: {
      _id,
      username,
      email,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const { _id, username, email } = newUser;
  res.status(201).json({
    status: 'success',
    requaestAt: Date.now(),
    message: 'Add New User Successfull',
    data: {
      _id,
      username,
      email,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates, please use /updatePassword', 400),
    );
  }

  const filterReqBody = filterObj(req.body, 'details', 'email');

  const updateUser = await User.findByIdAndUpdate(req.params.id, filterReqBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  const {
    _id, username, email,
  } = user;

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    user: {
      _id,
      username,
      email,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    requesAt: Date.now(),
    message: 'Delete user successfull',
  });
});

exports.findDoctor = catchAsync(async (req, res) => {
  const doctor = await Doctor.aggregate([
    {
      $sample: {
        size: 1,
      },
    },
  ]);

  const data = await doctor.map((e) => ({
    doctor_id: e._id,
    details: e.details,
  }));

  const { doctor_id } = data[0];
  const doctor_name = data[0].details.full_name;

  const addPatient = await Doctor.updateOne(
    { _id: doctor_id },
    {
      $push: { patients: req.params.id },
    },
  );

  const disease = await Disease.updateOne(
    { _id: req.body.disease_id },
    {
      $set: {
        doctor: doctor_id,
      },
    },
  );

  const user = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        handled_by: {
          doctor_id,
          doctor_name,
        },
      },
    },
  );

  if (!doctor && !user && !disease && !addPatient) {
    return next(
      new AppError('No doctor or user disease found', 404),
    );
  }

  res.status(201).json({
    status: 'success',
    requaestAt: Date.now(),
    data: data[0],
  });
});

exports.detailDoctor = catchAsync(async (req, res, next) => {
  const getHandled = await User.findById(req.params.id);

  const getDetailDoctor = await Doctor.findById(getHandled.handled_by.doctor_id);

  if (getDetailDoctor === null) {
    return next(
      new AppError('No Doctor found!', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    doctor: {
      _id: getDetailDoctor._id,
      details: getDetailDoctor.details,
    },
  });
});

exports.cancelConsult = catchAsync(async (req, res, next) => {
  const removeStatusUser = await User.updateOne(
    { _id: req.params.id },
    {
      $unset: {
        'handled_by.doctor_id': '',
        'handled_by.doctor_name': '',
      },
    },
  );

  const removeSchedule = await Schedule.findOneAndRemove(
    {
      users: req.params.id,
      doctors: req.params.doctor_id,
    },
  );

  const removeDiseaseDoctor = await Disease.findOneAndRemove(
    {
      users: req.params.id,
      doctors: req.params.doctor_id,
    },
  );

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

  if (!removePatient && !removeSchedule && !removeStatusUser && !removeDiseaseDoctor) {
    return next(
      new AppError('no doctor_id, user_id, or disease_id  found with the IDs', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    message: 'cancel Consultation Succesfull!',
  });
});

exports.profile = catchAsync(async (req, res, next) => {
  const token = await req.headers.authorization.split(' ')[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // query user profile
  const user = await User.findById(decoded.id);
  const {
    _id, username, email, details, schedule, handled_by,
  } = user;

  // query schedule
  const schedule_data = await Schedule.find({
    _id: {
      $in: schedule,
    },
  });

  if (!user) {
    return next(
      new AppError('No tour found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    profile: {
      _id,
      username,
      email,
      details,
      schedule_data,
      handled_by,
    },
  });
});
