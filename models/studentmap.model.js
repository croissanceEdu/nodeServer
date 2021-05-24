const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentMapSchema = new Schema({

  studentID: mongoose.Types.ObjectId,
  teacherID: mongoose.Types.ObjectId,
  classLink: { type: String, default: "" },
  feesAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  feesCurrency: { type: String, default: "$" },
  courseName: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

const StudentMap = mongoose.model('StudentMap', studentMapSchema);

module.exports = StudentMap;