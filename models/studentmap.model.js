const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentMapSchema = new Schema({

  studentID:mongoose.Types.ObjectId,
  teacherID:mongoose.Types.ObjectId,
  classLink:{type:String, default:""}
}, {
  timestamps: true,
});

const StudentMap = mongoose.model('StudentMap', studentMapSchema);

module.exports = StudentMap;