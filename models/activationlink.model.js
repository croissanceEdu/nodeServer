const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activationlinkSchema = new Schema({
  name: String,
  email: String,
  imagePath: String,
  role: String,
  token: String,
  activated: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  actionBy: mongoose.Types.ObjectId,
  reason: String
}, {
  timestamps: true,
});

const ActivationLink = mongoose.model('ActivationLink', activationlinkSchema);

module.exports = ActivationLink;