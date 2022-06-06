const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    disease_name: String,
    confidence: mongoose.Decimal128,
    disease_img: String,
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('disease', diseaseSchema);
