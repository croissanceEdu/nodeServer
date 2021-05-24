const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  titleName: String,
  messageContent: String,
  studentMapID: mongoose.Types.ObjectId,
  fromID: mongoose.Types.ObjectId,
  toID: mongoose.Types.ObjectId,
  isDeliverStatus: { type: Boolean, default: false },
  isReadStatus: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;