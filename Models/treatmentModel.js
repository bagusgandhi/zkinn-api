const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  schedule: [],
  users: mongoose.Types.ObjectId,
  doctors: mongoose.Types.ObjectId,
});

module.exports = mongoose.model('treatment', treatmentSchema);
