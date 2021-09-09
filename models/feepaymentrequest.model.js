const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feePaymentRequestSchema = new Schema({
    userID: mongoose.Types.ObjectId,
    shiftID: mongoose.Types.ObjectId,
    studentMapID: mongoose.Types.ObjectId,
    paymentScheduleID: mongoose.Types.ObjectId,
    senderID: mongoose.Types.ObjectId,
    receiverID: mongoose.Types.ObjectId,
    paidAmount: { type: Number, default: 0 },
    currency: { type: String, default: "" },
    paymentMethod: { type: String, default: "" },
    comment: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isNewStatus: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const FeePaymentRequest = mongoose.model('FeePaymentRequest', feePaymentRequestSchema);

module.exports = FeePaymentRequest;