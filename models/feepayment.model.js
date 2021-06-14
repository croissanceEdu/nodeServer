const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feePaymentSchema = new Schema({
    userId: mongoose.Types.ObjectId,
    studentMapId: mongoose.Types.ObjectId,
    paymentScheduleID: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId,
    receiverId: mongoose.Types.ObjectId,
    paidAmount: { type: Number, default: 0 },
    currency: { type: String, default: "" },
    paymentMethod: { type: String, default: "" },
    comment: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isNewStatus: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

module.exports = FeePayment;