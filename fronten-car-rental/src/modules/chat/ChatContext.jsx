import React, { createContext, useContext } from 'react';
import { useChat } from './useChat';

const ChatContext = createContext();

export const ChatProvider = ({ children, userId, role, isAdmin }) => {
    const chat = useChat({ userId, role, isAdmin });
    return (
        <ChatContext.Provider value={chat}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext); 