const User = require('../Models/userModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
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
    _id, username, email, password,
  } = user;

  if (!user) {
    next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    user: {
      _id,
      username,
      email,
      password,
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

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  const {
    _id, username, email, password,
  } = user;

  if (!user) {
    next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    user: {
      _id,
      username,
      email,
      password,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  res.status(204).json({
    status: 'success',
    requesAt: Date.now(),
    message: 'Delete user successfull',
  });
});
