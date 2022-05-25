const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'please fill the username'],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'please fill your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'pleade fill valid email'],
  },
  password: {
    type: String,
    required: [true, 'please create your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please fill confirm password correctly'],
    validate: {
      // create and save only
      validator(el) {
        return el === this.password;
      },
      messgae: 'password confirm not match!!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  details: {
    nik: String,
    full_name: String,
    date_of_birth: String,
    gender: String,
    address: String,
    religion: String,
    profession: String,
    nationality: String,
    age: Number,
    weight: Number,
  },
  disease: [{ type: mongoose.Schema.Types.ObjectId, ref: 'disease' }],
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'schedule' }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  // for modified password
  if (!this.isModified('password')) {
    return next();
  }

  // hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  // delete confirm password field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 + 60 + 1000;

  return resetToken;
};

module.exports = mongoose.model('user', userSchema);
