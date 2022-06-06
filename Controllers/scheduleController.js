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
    doctors: req.params.doctor_id,
    users: req.params.user_id,
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

// user
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

exports.getScheduleById = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.schedule_id);

  if (!schedule) {
    return next(
      new AppError('Schedule id not found', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    schedule,
  });
});

exports.doneTask = catchAsync(async (req, res, next) => {
  const scheduleItems = await Schedule.findOneAndUpdate(
    {
      _id: req.params.schedule_id,
      items: {
        $elemMatch: {
          _id: req.params.items_id,
        },
      },
    },
    {
      $set: {
        'items.$.done': req.body.done, // update items
      },
    },
  );

  if (!scheduleItems) {
    return next(
      new AppError('No schedule or items found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    message: 'task edited successfully!',
  });
});

// doctor
exports.getScheduleByUser = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.find({
    users: req.params.user_id,
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

exports.getAllSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.find({
    doctors: req.params.doctor_id,
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

exports.deleteSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndRemove(req.params.schedule_id);

  if (!schedule) {
    return next(
      new AppError('Schedule not found!', 404),
    );
  }

  const { _id } = schedule;
  await User.updateOne(
    { _id: schedule.users },
    { $pull: { schedule: _id } },
  );

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    schedule,
  });
});

exports.getItems = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findOne(
    {
      _id: req.params.schedule_id,
      items: {
        $elemMatch: {
          _id: req.params.items_id,
        },
      },
    },
  );

  if (!schedule) {
    return next(
      new AppError('No schedule or items found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    schedule,
  });
});

exports.updateSchedule = catchAsync(async (req, res, next) => {
  const scheduleItems = await Schedule.findOneAndUpdate(
    {
      _id: req.params.schedule_id,
      items: {
        $elemMatch: {
          _id: req.params.items_id,
        },
      },
    },
    {
      $set: {
        'items.$': req.body, // update items
      },
    },
  );

  if (!scheduleItems) {
    return next(
      new AppError('No schedule or items found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    requaestAt: Date.now(),
    scheduleItems,
  });
});
