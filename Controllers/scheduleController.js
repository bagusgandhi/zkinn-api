const Schedule = require('../Models/scheduleModel');
const User = require('../Models/userModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');

exports.createSchedule = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.user_id);

  if (!user) {
    return next(
      new AppError('No user found with that ID', 404),
    );
  }

  const schedule = await Schedule.create({
    items: req.body.items,
    users: req.params.user_id,
    doctor: req.params.doctor_id,
  });

  const { _id } = schedule;
  await User.updateOne(
    { _id: req.params.user_id },
    { $push: { schedule: _id } },
  );

  res.status(201).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Schedule Added Successfully',
    data: schedule,
  });
});

exports.getSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.find({
    users: req.params.id,
  });

  if (!schedule) {
    return next(
      new AppError('User does not have a schedule', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    schedule,
  });
});
