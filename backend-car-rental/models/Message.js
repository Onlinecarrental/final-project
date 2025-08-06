const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: String, required: true },
    senderRole: { type: String, enum: ['customer', 'agent', 'admin', 'system'], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    clearedFor: [{ type: String, default: [] }] // Array of userIds for whom this message is hidden
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema); 