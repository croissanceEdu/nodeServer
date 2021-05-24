const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    userId: mongoose.Types.ObjectId,
    dateOfBirth: { type: Date, default: new Date() },
    contactNumber: { type: String, default: "" },
    fullAddress: { type: String, default: "" },
    gender: { type: String, default: "" },
    qualification: { type: String, default: "" }
}, {
    timestamps: true,
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;