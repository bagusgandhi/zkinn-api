const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    disease_name: String,
    disease_details: Object,
    disease_img: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('disease', diseaseSchema);
