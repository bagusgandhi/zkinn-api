const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please fill confirm password correctly'],

  },
  details: {
    nik: String,
    full_name: String,
    date_of_birth: Date,
    gender: String,
    address: String,
    religion: String,
    profession: String,
    nationality: String,
    age: Number,
    weight: Number,
  },
  disease: [mongoose.Types.ObjectId],
});

module.exports = mongoose.model('user', userSchema);
