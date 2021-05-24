const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const syllabusSchema = new Schema({
  chapterName: String,
  moduleName: String,
  studentMapID: mongoose.Types.ObjectId,
  studentID: mongoose.Types.ObjectId,
  teacherID: mongoose.Types.ObjectId,
  studentMessage: { type: String, default: "" },
  teacherMessage: { type: String, default: "" },
  studentComplete: { type: Boolean, default: false },
  teacherComplete: { type: Boolean, default: false },
  isNewStatus: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

module.exports = Syllabus;