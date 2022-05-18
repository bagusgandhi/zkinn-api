const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    disease_name: String,
    confidence: mongoose.Decimal128,
    disease_img: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('disease', diseaseSchema);
