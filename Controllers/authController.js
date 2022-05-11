const User = require('../Models/userModel');

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    requestAt: JSON.stringify(new Date()),
    message: 'Add New User Successfull',
    data: {
      user: newUser,
    },
  });
};
