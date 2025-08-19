import axios from 'axios';

export const getUserChats = async (userId, role) => {
    // Use userId for customers, agentId for agents
    const param = role === 'customer' ? 'userId' : 'agentId';
    const res = await axios.get(`https://backend-car-rental-production.up.railway.app/api/chats?${param}=${userId}&role=${role}`);
    return res.data.data;
};

export const getAllChats = async () => {
    const res = await axios.get('https://backend-car-rental-production.up.railway.app/api/chats?role=admin');
    return res.data.data;
};

export const getChatMessages = async (chatId, userId, role) => {
    const res = await axios.get(`https://backend-car-rental-production.up.railway.app/api/chats/${chatId}/messages?userId=${userId}&role=${role}`);
    return res.data.data;
};

export const sendMessage = async (chatId, senderId, senderRole, text) => {
    const res = await axios.post('https://backend-car-rental-production.up.railway.app/api/chats/messages', {
        chatId, senderId, senderRole, text
    });
    return res.data.data;
};

export const deleteMessage = async (messageId, userId, role) => {
    const res = await axios.delete(`https://backend-car-rental-production.up.railway.app/api/chats/messages/${messageId}?userId=${userId}&role=${role}`);
    return res.data;
};

export const editMessage = async (messageId, text, userId, role) => {
    const res = await axios.patch(`https://backend-car-rental-production.up.railway.app/api/chats/messages/${messageId}?userId=${userId}&role=${role}`, { text });
    return res.data;
};

export const deleteChat = async (chatId, userId, role) => {
    const res = await axios.delete(`https://backend-car-rental-production.up.railway.app/api/chats/${chatId}?userId=${userId}&role=${role}`);
    return res.data;
};

export const clearChat = async (chatId, userId, role) => {
    const res = await axios.delete(`https://backend-car-rental-production.up.railway.app/api/chats/${chatId}/messages?userId=${userId}&role=${role}`);
    return res.data;
};

export const markMessagesAsRead = async (chatId, userId, role) => {
    const res = await axios.patch(`https://backend-car-rental-production.up.railway.app/api/chats/${chatId}/mark-read`, {
        userId,
        role
    });
    return res.data;
};