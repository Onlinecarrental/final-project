import axios from 'axios';

const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";

export const getUserChats = async (userId, role) => {
    // Use userId for customers, agentId for agents
    const param = role === 'customer' ? 'userId' : 'agentId';
    const res = await axios.get(`${API_BASE_URL}/api/chats?${param}=${userId}&role=${role}`);
    return res.data.data;
};

export const getAllChats = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/chats?role=admin`);
    return res.data.data;
};

export const getChatMessages = async (chatId, userId, role) => {
    const res = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/messages?userId=${userId}&role=${role}`);
    return res.data.data;
};

export const sendMessage = async (chatId, senderId, senderRole, text) => {
    const res = await axios.post(`${API_BASE_URL}/api/chats/messages`, {
        chatId, senderId, senderRole, text
    });
    return res.data.data;
};

export const deleteMessage = async (messageId, userId, role) => {
    const res = await axios.delete(`${API_BASE_URL}/api/chats/messages/${messageId}?userId=${userId}&role=${role}`);
    return res.data;
};

export const editMessage = async (messageId, text, userId, role) => {
    const res = await axios.patch(`${API_BASE_URL}/api/chats/messages/${messageId}?userId=${userId}&role=${role}`, { text });
    return res.data;
};

export const deleteChat = async (chatId, userId, role) => {
    const res = await axios.delete(`${API_BASE_URL}/api/chats/${chatId}?userId=${userId}&role=${role}`);
    return res.data;
};

export const clearChat = async (chatId, userId, role) => {
    const res = await axios.delete(`${API_BASE_URL}/api/chats/${chatId}/messages?userId=${userId}&role=${role}`);
    return res.data;
}; 