const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: { type: String, default: "" },
    courseDescription: { type: String, default: "" },
    courseDetails: { type: String, default: "" },
    teacherID: mongoose.Types.ObjectId,
    feesAmount: { type: Number, default: 0 },
    feesCurrency: { type: String, default: "$" },
    feesDetails: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;