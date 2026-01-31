const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    gateway: { type: String, required: true }, // e.g., 'MBBank', 'ACB'
    transactionDate: { type: Date, required: true },
    accountNumber: { type: String, required: true },
    subAccount: { type: String },
    code: { type: String }, // Transaction code from the bank
    content: { type: String, required: true }, // Payment content (Important for identifying User)
    transferType: { type: String }, // in/out
    transferAmount: { type: Number, required: true },
    accumulated: { type: Number }, // Balance after transaction
    description: { type: String },
    referenceCode: { type: String }, // SePay reference code
    invoiceNumber: { type: String }, // SePay Order Invoice Number
    // Link to User
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['processed', 'unprocessed', 'failed', 'paid', 'cancelled'], default: 'unprocessed' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
