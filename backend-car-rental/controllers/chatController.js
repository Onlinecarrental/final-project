const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Helper: check if user is admin
function isAdmin(role) {
    return role === 'admin';
}

const chatController = {
    // Create or get a chat between customer and agent
    createChat: async (req, res) => {
        try {
            const { userId, agentId } = req.body;
            if (!userId || !agentId) {
                return res.status(400).json({ success: false, message: 'userId and agentId are required' });
            }
            let chat = await Chat.findOne({ userId, agentId });
            if (!chat) {
                chat = new Chat({
                    userId,
                    agentId,
                    participants: [userId, agentId], // <-- This is critical!
                });
                await chat.save();
            }
            res.json({ success: true, data: chat });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get all chats for a user/agent or all (admin)
    getChats: async (req, res) => {
        try {
            const { userId, agentId, role } = req.query;
            if (isAdmin(role)) {
                // Admin: return all chats
                const chats = await Chat.find().sort('-updatedAt');
                return res.json({ success: true, data: chats });
            }
            // User/Agent: only their chats
            let filter = {};
            if (userId) filter.userId = userId;
            if (agentId) filter.agentId = agentId;
            if (!userId && !agentId) {
                return res.status(400).json({ success: false, message: 'userId or agentId required' });
            }
            const chats = await Chat.find(filter).sort('-updatedAt');
            res.json({ success: true, data: chats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get messages for a chat (privacy: only participants or admin)
    getMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { userId, role } = req.query;
            const chat = await Chat.findById(chatId);
            if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
            if (!isAdmin(role) && !chat.participants.includes(userId)) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
            // Only return messages not cleared for this user
            const messages = await Message.find({ chatId, clearedFor: { $ne: userId } }).sort('createdAt');
            res.json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Send a message (privacy: only participants or admin)
    sendMessage: async (req, res) => {
        try {
            const { chatId, senderId, senderRole, text } = req.body;
            if (!chatId || !senderId || !senderRole || !text) {
                return res.status(400).json({ success: false, message: 'chatId, senderId, senderRole, and text are required' });
            }
            const chat = await Chat.findById(chatId);
            if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
            if (!isAdmin(senderRole) && !chat.participants.includes(senderId)) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
            const message = await Message.create({ chatId, senderId, senderRole, text });
            // Update chat last message
            chat.lastMessage = text;
            chat.lastMessageAt = new Date();
            await chat.save();
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete a single message (privacy: only participants or admin)
    deleteMessage: async (req, res) => {
        try {
            const { messageId } = req.params;
            const { userId, role } = req.query;
            const message = await Message.findById(messageId);
            if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
            const chat = await Chat.findById(message.chatId);
            if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
            if (!isAdmin(role) && !chat.participants.includes(userId)) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
            await message.deleteOne();
            res.json({ success: true, message: 'Message deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete a chat and all its messages (privacy: only participants or admin)
    deleteChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { userId, role } = req.query;
            const chat = await Chat.findById(chatId);
            if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
            if (!isAdmin(role) && !chat.participants.includes(userId)) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
            await Message.deleteMany({ chatId });
            await chat.deleteOne();
            res.json({ success: true, message: 'Chat and all messages deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Clear all messages in a chat (privacy: only participants or admin)
    clearChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { userId, role } = req.query;
            const chat = await Chat.findById(chatId);
            if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
            if (!isAdmin(role) && !chat.participants.includes(userId)) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
            if (isAdmin(role)) {
                // Admin: delete all messages
                await Message.deleteMany({ chatId });
                return res.json({ success: true, message: 'All messages cleared from chat (admin)' });
            } else {
                // Customer/Agent: add userId to clearedFor for all messages in this chat
                await Message.updateMany({ chatId, clearedFor: { $ne: userId } }, { $push: { clearedFor: userId } });
                return res.json({ success: true, message: 'Chat cleared for this user only' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Edit a single message (only sender or admin)
    editMessage: async (req, res) => {
        try {
            const { messageId } = req.params;
            const { userId, role } = req.query;
            const { text } = req.body;
            if (!text) return res.status(400).json({ success: false, message: 'Text is required' });
            const message = await Message.findById(messageId);
            if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
            if (message.senderId !== userId && !isAdmin(role)) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
            message.text = text;
            await message.save();
            res.json({ success: true, data: message });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = chatController; 