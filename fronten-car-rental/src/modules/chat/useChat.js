import { useState, useEffect } from 'react';
import { getUserChats, getAllChats, getChatMessages, sendMessage, deleteMessage as apiDeleteMessage, deleteChat as apiDeleteChat, clearChat as apiClearChat, editMessage as apiEditMessage } from './chatApi';

export function useChat({ userId, role, isAdmin }) {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch chats
    useEffect(() => {
        setLoading(true);
        setError(null);
        if (isAdmin) {
            getAllChats().then(setChats).catch(setError).finally(() => setLoading(false));
        } else if (userId && role) {
            getUserChats(userId, role).then(setChats).catch(setError).finally(() => setLoading(false));
        }
    }, [userId, role, isAdmin]);

    // Fetch messages for active chat
    useEffect(() => {
        if (activeChatId) {
            setLoading(true);
            getChatMessages(activeChatId, userId, role)
                .then(setMessages)
                .catch(setError)
                .finally(() => setLoading(false));
        } else {
            setMessages([]);
        }
    }, [activeChatId, userId, role]);

    // Send message
    const send = async (text) => {
        if (!activeChatId || !userId) return;
        // Optimistically add the message
        const optimisticMsg = {
            _id: 'temp-' + Date.now(),
            text,
            senderId: userId,
            senderName: '', // Optionally fill if you have the name
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setLoading(true);
        try {
            await sendMessage(activeChatId, userId, role, text);
            const msgs = await getChatMessages(activeChatId, userId, role);
            setMessages(msgs);
        } catch (err) {
            setError(err);
            // Optionally: remove the optimistic message or mark as failed
        } finally {
            setLoading(false);
        }
    };

    // Delete a single message
    const deleteMessage = async (messageId) => {
        if (!activeChatId || !userId) return;
        setLoading(true);
        try {
            await apiDeleteMessage(messageId, userId, role);
            const msgs = await getChatMessages(activeChatId, userId, role);
            setMessages(msgs);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Edit a single message
    const editMessage = async (messageId, newText) => {
        if (!activeChatId || !userId) return;
        setLoading(true);
        try {
            await apiEditMessage(messageId, newText, userId, role);
            const msgs = await getChatMessages(activeChatId, userId, role);
            setMessages(msgs);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete a chat and all its messages
    const deleteChat = async (chatId) => {
        if (!chatId || !userId) return;
        setLoading(true);
        try {
            await apiDeleteChat(chatId, userId, role);
            // Remove chat from list and reset active chat
            setChats(prev => prev.filter(c => c._id !== chatId));
            if (activeChatId === chatId) {
                setActiveChatId(null);
                setMessages([]);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Clear all messages in a chat
    const clearChat = async (chatId) => {
        if (!chatId || !userId) return;
        setLoading(true);
        try {
            await apiClearChat(chatId, userId, role);
            setMessages([]);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        chats,
        messages,
        setActiveChatId,
        send,
        activeChatId,
        loading,
        error,
        deleteMessage,
        deleteChat,
        clearChat,
        editMessage,
    };
} 