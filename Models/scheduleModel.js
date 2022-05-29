const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    items: [
      {
        title: String,
        content: String,
        time: String,
      },
    ],
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    doctors: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('schedule', scheduleSchema);
