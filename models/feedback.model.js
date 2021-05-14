const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  titleName: String,
  messageContent:String,
  fromID:mongoose.Types.ObjectId,
  toID:mongoose.Types.ObjectId,
  isDeliverStatus:{type:Boolean, default:false},
  isReadStatus:{type:Boolean, default:false}
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;