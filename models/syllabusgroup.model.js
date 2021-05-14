const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const syllabusGroupSchema = new Schema({
  chapterName: String,
  moduleName:String,
  groupID:mongoose.Types.ObjectId,
 
}, {
  timestamps: true,
});

const Syllabus = mongoose.model('SyllabusGroup', syllabusGroupSchema);

module.exports = Syllabus;