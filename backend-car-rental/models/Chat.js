const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },      // Customer UID
    agentId: { type: String, required: true },     // Agent UID
    participants: [{ type: String, required: true }], // Array of user IDs (customer and agent)
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema); 