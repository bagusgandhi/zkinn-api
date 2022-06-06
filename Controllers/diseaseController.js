const Disease = require('../Models/diseaseModel');
const User = require('../Models/userModel');
const catchAsync = require('../Helpers/catchAsync');
const AppError = require('../Helpers/appError');

exports.createDisease = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const disease = await Disease.create(
    {
      disease_name: req.body.disease_name,
      confidence: req.body.confidence,
      disease_img: req.body.disease_img,
      users: req.params.id,
    },
  );
  const { _id } = disease;
  await User.updateOne(
    { _id: req.params.id },
    { $push: { disease: _id } },
  );

  res.status(201).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Disease Added Successfully',
    data: disease,
  });
});

exports.getAllDisease = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = await user.disease;
  const allDisease = await Disease.find({ _id: { $in: data } });

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    data: allDisease,
  });
});

exports.getDisease = catchAsync(async (req, res, next) => {
  const disease = await Disease.findById(req.params.disease_id);
  const user = await User.findById(req.params.id);

  if (!disease) {
    return next(
      new AppError('No disease or user found with that ID', 404),
    );
  }

  const { _id, username } = user;

  res.status(200).json({
    status: 'success',
    requestAt: Date.now(),
    data: {
      _id,
      username,
      disease,
    },
  });
});

exports.deleteDisease = catchAsync(async (req, res, next) => {
  const disease = await Disease.findByIdAndDelete(req.params.disease_id);
  const user = await User.findById(req.params.id);

  if (!disease && !user) {
    return next(
      new AppError('No disease or user found with that ID', 404),
    );
  }

  await User.updateOne(
    { _id: req.params.id },
    { $pull: { disease: req.params.disease_id } },
  );

  res.status(204).json({
    status: 'success',
    requestAt: Date.now(),
    message: 'Disease Data Successfully deleted',
    data: {
      _id: user._id,
      username: user.username,
      disease: {
        disease_id: req.params.disease_id,
      },
    },
  });
});
