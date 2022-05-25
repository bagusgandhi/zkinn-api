/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
    passwordChangedAt: req.body.passwordChangedAt,
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

exports.protect = catchAsync(async (req, res, next) => {
  // check token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not login, please login first', 401));
  }
  // validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check user
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user to this token no loger exist', 401));
  }
  // check if password changed after token jwt
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently has changed the password! Please login again', 401));
  }
  req.user = freshUser;
  next();
});

exports.allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You dont have permission', 403),
    );
  }

  next();
};

exports.forgotPassword = async (req, res, next) => {
  const user = User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('There is no User with this email', 404),
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();
};

exports.resetPassword = (req, res, next) => {

};
