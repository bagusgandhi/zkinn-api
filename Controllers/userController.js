const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../Models/userModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');
const Doctor = require('../Models/doctorModel');
const Schedule = require('../Models/scheduleModel');

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

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    data,
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
