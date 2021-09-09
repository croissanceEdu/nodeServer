const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const razorpayPaymentSchema = new Schema({
    shiftID: mongoose.Types.ObjectId,
    feePaymentID: mongoose.Types.ObjectId,
    orderCreationID: { type: String, default: "" },
    razorpayPaymentID: { type: String, default: "" },
    razorpayOrderID: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    isTestPayment: { type: Boolean, default: false },

}, {
    timestamps: true,
});




const RazorpayPayment = mongoose.model('RazorpayPayment', razorpayPaymentSchema);

module.exports = RazorpayPayment;