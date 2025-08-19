import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../../modules/chat/useChat';
import { getCustomerNameById, getAgentNameById } from '../../modules/chat/chatUtils';

export default function AdminChat() {
    // Assume admin info is stored in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const { chats, messages, setActiveChatId, send, activeChatId, loading, error, deleteMessage, clearChat, deleteChat } = useChat({
        userId: user?.uid,
        role: user?.role,
        isAdmin: true
    });
    const [names, setNames] = useState({}); // {chatId: {customerName, agentName}}
    const messagesContainerRef = useRef(null);

    // Set the first chat as active by default
    useEffect(() => {
        if (chats.length > 0 && !activeChatId) {
            setActiveChatId(chats[0]._id);
        }
    }, [chats, activeChatId, setActiveChatId]);

    // Fetch customer and agent names for all chats
    useEffect(() => {
        async function fetchNames() {
            const newNames = {};
            for (const chat of chats) {
                if (!names[chat._id]) {
                    const [customerName, agentName] = await Promise.all([
                        getCustomerNameById(chat.userId),
                        getAgentNameById(chat.agentId)
                    ]);
                    newNames[chat._id] = { customerName, agentName };
                }
            }
            if (Object.keys(newNames).length > 0) {
                setNames(prev => ({ ...prev, ...newNames }));
            }
        }
        if (chats.length > 0) fetchNames();
        // eslint-disable-next-line
    }, [chats]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full h-[80vh] flex bg-white rounded-lg shadow overflow-hidden font-jakarta">
            {/* Sidebar: Chat List */}
            <div className="w-[340px] min-w-[260px] border-r bg-grayflex flex-col">
                <div className="p-4 border-b font-bold text-lg flex items-center bg-white">
                    Admin Chat — All Conversations
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-2">
                    {loading ? (
                        <div className="text-center text-gray-400 mt-10">Loading chats...</div>
                    ) : chats.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">No chats found</div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat._id}
                                onClick={() => setActiveChatId(chat._id)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer shadow-sm mb-2 transition-all ${activeChatId === chat._id ? 'bg-blue-100 border border-blue-400' : 'bg-white hover:bg-gray-100'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl">
                                    {/* Avatar: first letter of customer */}
                                    {names[chat._id]?.customerName ? names[chat._id].customerName[0] : 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate text-gray-900">{names[chat._id]?.customerName || chat.userId}</div>
                                    <div className="text-xs text-gray-500 truncate">{names[chat._id]?.agentName || chat.agentId}</div>
                                    <div className="text-xs text-gray-400 truncate mt-1">{chat.lastMessage?.text || 'No messages yet'}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400">{chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 bg-white p-4 border-b shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-2xl">
                        {activeChatId && names[activeChatId]?.customerName ? names[activeChatId].customerName[0] : 'U'}
                    </div>
                    <div className="font-semibold text-lg text-gray-900 flex-1">
                        {activeChatId && names[activeChatId]?.customerName ? names[activeChatId].customerName : 'Select a chat'}
                        {activeChatId && names[activeChatId]?.agentName && (
                            <span className="text-gray-400 font-normal"> &nbsp;↔&nbsp; {names[activeChatId].agentName}</span>
                        )}
                    </div>
                    {/* Clear Chat Button for Admin */}
                    {activeChatId && (
                        <>
                            <button
                                className="ml-auto px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700 transition-colors"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to clear all messages in this chat for everyone?')) {
                                        clearChat(activeChatId);
                                    }
                                }}
                            >
                                Clear Chat
                            </button>
                            <button
                                className="ml-2 px-3 py-1 rounded bg-red-700 text-white hover:bg-red-900 transition-colors"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this chat and all its messages for everyone?')) {
                                        deleteChat(activeChatId);
                                    }
                                }}
                            >
                                Delete Chat
                            </button>
                        </>
                    )}
                </div>
                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 bg-white flex flex-col gap-4">
                    {error && <div className="text-red-500">{error.message || error.toString()}</div>}
                    {messages.length === 0 ? (
                        <div className="text-gray-400 text-center mt-10">No messages yet</div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg._id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'} group`}>
                                <div className={`relative max-w-xs px-4 py-2 rounded-[12px] shadow
  ${msg.senderRole === 'admin'
                                        ? 'bg-blue-100 text-blue-900'
                                        : msg.senderRole === 'agent'
                                            ? 'bg-green-100 text-green-900'
                                            : 'bg-gray-100 text-gray-900'}`}>
                                    <div className="text-xs font-semibold mb-1 text-gray-500">
                                        {msg.senderRole === 'admin' ? 'Admin' : msg.senderRole === 'agent' ? 'Agent' : 'Customer'}
                                    </div>
                                    <div className="text-lg">{msg.text}</div>
                                    <div className="text-xs text-right text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    {/* Delete button for admin's own messages */}
                                    {msg.senderRole === 'admin' && (
                                        <button
                                            className="absolute top-1 right-1 p-1 rounded-full bg-red-400 text-white hover:bg-red-600 transition-colors"
                                            title="Delete message"
                                            onClick={() => {
                                                if (window.confirm('Delete this message?')) {
                                                    deleteMessage(msg._id);
                                                }
                                            }}
                                        >
                                            {/* Trash icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Input */}
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        const text = e.target.elements.message.value;
                        if (text) {
                            send(text);
                            e.target.reset();
                        }
                    }}
                    className="flex items-center gap-2 p-4 bg-grayborder-t"
                >
                    <input
                        name="message"
                        type="text"
                        placeholder="Type your message..."
                        autoComplete="off"
                        className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring"
                    />
                    <button type="submit" className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition-colors flex items-center justify-center" aria-label="Send">
                        {/* Paper plane SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21l16.5-9-16.5-9v7.5l11.25 1.5-11.25 1.5V21z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
} 