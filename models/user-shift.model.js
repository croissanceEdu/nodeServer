const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userShiftSchema = new Schema({
    userID: mongoose.Types.ObjectId,
    ipAddress: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
});

const UserShift = mongoose.model('UserShift', userShiftSchema);

module.exports = UserShift;