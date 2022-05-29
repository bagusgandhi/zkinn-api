/* eslint-disable prefer-destructuring */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Doctor = require('../Models/doctorModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');
const sendEmail = require('../Helpers/email');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

exports.register = catchAsync(async (req, res, next) => {
  const newDoctor = await Doctor.create({
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
  const token = signToken(newDoctor._id);

  res.status(201).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Account Created successfull',
    token,
    data: {
      doctor: newDoctor,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if exist
  if (!email || !password) {
    return next(
      new AppError('please provide an email and password', 400),
    );
  }

  // check if correct
  const doctor = await Doctor.findOne({ email }).select('+password');
  if (!doctor || !(await doctor.correctPassword(password, doctor.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // if ok
  const token = signToken(doctor._id);
  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Login successfull',
    doctor_id: doctor._id,
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
    return next(
      new AppError('You are not login, please login first', 401),
    );
  }
  // validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check doctor
  const currentAccount = await Doctor.findById(decoded.id);
  if (!currentAccount) {
    return next(
      new AppError('The doctor account to this token no longer exist', 401),
    );
  }
  // check if password changed after token jwt
  if (currentAccount.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('Doctor account recently has changed the password! Please login again', 401),
    );
  }
  req.doctor = currentAccount;
  next();
});

exports.allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.doctor.role)) {
    return next(
      new AppError('You dont have permission', 403),
    );
  }

  next();
};

exports.forgotPassword = async (req, res, next) => {
  const doctor = await Doctor.findOne({ email: req.body.email });

  if (!doctor) {
    return next(
      new AppError('There is no Doctor account with this email', 404),
    );
  }

  const resetToken = doctor.createPasswordResetToken();
  await doctor.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/doctors/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nif you didn't forget your password, please ignore this email anda just login `;

  try {
    await sendEmail({
      email: doctor.email,
      subject: 'Your password reset token (valid for 10 minute)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email',
    });
  } catch (err) {
    doctor.passwordResetToken = undefined;
    doctor.passwordResetExpires = undefined;
    await doctor.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Try again later!', 500),
    );
  }
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const doctor = await Doctor.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!doctor) {
    return next(
      new AppError('Token was invalid beacause expired', 400),
    );
  }

  doctor.password = req.body.password;
  doctor.passwordConfirm = req.body.passwordConfirm;
  doctor.passwordResetToken = undefined;
  doctor.passwordResetExpires = undefined;
  await doctor.save();

  const token = signToken(doctor._id);

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Login successfull',
    doctor_id: doctor._id,
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).select('+password');

  if (!(await doctor.correctPassword(req.body.passwordCurrent, doctor.password))) {
    return next(
      new AppError('Your current password is wrong.', 401),
    );
  }

  doctor.password = req.body.password;
  doctor.passwordConfirm = req.body.passwordConfirm;
  await doctor.save();

  const token = signToken(doctor._id);
  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Update Password successfull',
    doctor_id: doctor._id,
    token,
  });
});
