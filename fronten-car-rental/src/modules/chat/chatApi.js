import axios from 'axios';

export const getUserChats = async (userId, role) => {
    // Use userId for customers, agentId for agents
    const param = role === 'customer' ? 'userId' : 'agentId';
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats?${param}=${userId}&role=${role}`);
    return res.data.data;
};

export const getAllChats = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats?role=admin`);
    return res.data.data;
};

export const getChatMessages = async (chatId, userId, role) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/messages?userId=${userId}&role=${role}`);
    return res.data.data;
};

export const sendMessage = async (chatId, senderId, senderRole, text) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats/messages`, {
        chatId, senderId, senderRole, text
    });
    return res.data.data;
};

export const deleteMessage = async (messageId, userId, role) => {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/messages/${messageId}?userId=${userId}&role=${role}`);
    return res.data;
};

export const editMessage = async (messageId, text, userId, role) => {
    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/chats/messages/${messageId}?userId=${userId}&role=${role}`, { text });
    return res.data;
};

export const deleteChat = async (chatId, userId, role) => {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}?userId=${userId}&role=${role}`);
    return res.data;
};

export const clearChat = async (chatId, userId, role) => {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/messages?userId=${userId}&role=${role}`);
    return res.data;
}; 