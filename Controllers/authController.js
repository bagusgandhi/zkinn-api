const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    details: {
      gender: req.body.details.gender,
      age: req.body.details.age,
      weight: req.body.details.weight,
    },
  });

  // create token
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Account Created successfull',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if exist
  if (!email || !password) {
    return next(new AppError('please provide an email and password', 400));
  }

  // check if correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // if ok
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Login successfull',
    token,
  });
});
