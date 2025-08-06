const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customer: { type: String, ref: 'User', required: true },
    agent: { type: String, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    stripePaymentIntentId: { type: String },
    stripePaymentMethodId: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], 
        default: 'pending' 
    },
    paymentMethod: { type: String, required: true },
    // Agent bank details for admin payment
    agentBankDetails: {
        agentName: { type: String },
        bankName: { type: String },
        accountNumber: { type: String },
        accountTitle: { type: String },
        branchCode: { type: String }
    },
    // Admin payment details
    adminPaymentDetails: {
        paymentDate: { type: Date },
        paymentMethod: { type: String },
        transactionId: { type: String },
        notes: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema); 