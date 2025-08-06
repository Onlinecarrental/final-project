const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    customer: { type: String, ref: 'User', required: true },
    agent: { type: String, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    paymentMethod: { type: String },
    paymentNumber: { type: String },
    // Payment reference
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    // Agent approval details
    agentApprovalDetails: {
        approvedAt: { type: Date },
        agentName: { type: String },
        bankName: { type: String },
        accountNumber: { type: String },
        accountTitle: { type: String },
        branchCode: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 