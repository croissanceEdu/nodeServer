const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentScheduleSchema = new Schema({
    userID: mongoose.Types.ObjectId,
    studentMapID: mongoose.Types.ObjectId,
    requestAmount: { type: Number, default: 0 },
    comment: { type: String, default: "" },
    warningDate: { type: Date, default: new Date() },
    lastDate: { type: Date, default: new Date() },
    isPaid: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isNewStatus: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const PaymentSchedule = mongoose.model('PaymentSchedule', paymentScheduleSchema);

module.exports = PaymentSchedule;