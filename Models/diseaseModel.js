const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  disease_name: String,
  disease_details: Object,
  timestamps: true,
});

module.exports = mongoose.model('disease', diseaseSchema);
