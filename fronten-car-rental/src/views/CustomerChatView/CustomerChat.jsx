import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../../modules/chat/useChat';
import { getAgentNameById } from '../../modules/chat/chatUtils';

export default function CustomerChat() {
    // Assume user info is stored in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const {
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
        markMessagesAsRead
    } = useChat({
        userId: user?.uid,
        role: 'customer',
        isAdmin: false
    });
    const [search, setSearch] = useState('');
    const [agentNames, setAgentNames] = useState({});
    const messagesContainerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    // selectMode and selectedChats removed
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editText, setEditText] = useState('');
    const [msgMenuOpen, setMsgMenuOpen] = useState(null); // messageId or null

    // Set the first chat as active by default
    useEffect(() => {
        if (chats.length > 0 && !activeChatId) {
            setActiveChatId(chats[0]._id);
        }
    }, [chats, activeChatId, setActiveChatId]);

    // Debug: Log the chats data structure
    useEffect(() => {
        console.log('Chats data:', chats);
        chats.forEach((chat, index) => {
            console.log(`Chat ${index}:`, {
                id: chat._id,
                agentName: chat.agentName,
                agentId: chat.agentId,
                lastMessage: chat.lastMessage,
                unreadCount: chat.unreadCount,
                fullChat: chat
            });
        });
    }, [chats]);

    // Filter chats by search
    const filteredChats = chats.filter(chat => {
        const name = chat.agentName || chat.agentId || '';
        return name.toLowerCase().includes(search.toLowerCase());
    });

    useEffect(() => {
        // Find agentIds that need fetching
        const missing = filteredChats
            .filter(chat => !chat.agentName && chat.agentId && !agentNames[chat.agentId])
            .map(chat => chat.agentId);

        if (missing.length > 0) {
            missing.forEach(async (agentId) => {
                const name = await getAgentNameById(agentId);
                if (name) {
                    setAgentNames(prev => ({ ...prev, [agentId]: name }));
                }
            });
        }
    }, [filteredChats, agentNames]);

    // Remove scroll lock logic and scroll to bottom on messages change or send
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    }, [messages]);

    const headerName = activeChatId ? agentNames[chats.find(chat => chat._id === activeChatId)?.agentId] || 'Agent NAme' : 'Agent NAme';

    // Handle chat selection
    const handleChatSelect = async (chatId) => {
        setActiveChatId(chatId);
        await markMessagesAsRead(chatId);
    };

    return (
        <div className="w-full h-[80vh] flex bg-white rounded-lg shadow overflow-hidden font-jakarta">
            {/* Sidebar: Chat List */}
            <div className="w-[340px] min-w-[260px] border-r bg-  flex flex-col">
                <div className="p-4 border-b font-bold text-lg justify-center flex items-center">Messages</div>
                <div className="p-3">
                    <input
                        type="text"
                        placeholder="SEARCH THE MESSAGE"
                        className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-2">
                    {filteredChats.map(chat => (
                        <div
                            key={chat._id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer shadow-sm mb-2 transition-all ${activeChatId === chat._id ? 'bg-gray' : 'bg-white hover:bg-gray-200'}`}
                            onClick={() => handleChatSelect(chat._id)}
                        >
                            <div
                                className="flex-1 flex items-center gap-3 min-w-0"
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xl">
                                    {/* Placeholder avatar */}
                                    {chat.agentName ? chat.agentName[0] : 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate">{chat.agentName || agentNames[chat.agentId] || 'Agent NAme'}</div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {chat.lastMessage ?
                                            (typeof chat.lastMessage === 'string' ?
                                                chat.lastMessage :
                                                (chat.lastMessage.text || 'No message text')
                                            ) :
                                            'No messages yet'}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400">
                                        {chat.updatedAt ?
                                            new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                            (chat.lastMessage?.createdAt ?
                                                new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                                ''
                                            )
                                        }
                                    </span>
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 bg-gray  p-4 border-b relative">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold text-2xl">
                        {headerName[0] || 'A'}
                    </div>
                    <div className="font-semibold text-lg flex-1">
                        {headerName}
                    </div>
                    {/* Menu button */}
                    <div className="relative">
                        <button
                            className="ml-auto p-2 rounded-full hover:bg-gray-400 transition-colors"
                            title="Menu"
                            onClick={() => setMenuOpen(m => !m)}
                        >
                            {/* Three dots icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <circle cx="5" cy="12" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="19" cy="12" r="1.5" />
                            </svg>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray "
                                    onClick={() => {
                                        setMenuOpen(false);
                                        if (window.confirm('Are you sure you want to clear all messages in this chat?')) {
                                            clearChat(activeChatId);
                                        }
                                    }}
                                    disabled={!activeChatId}
                                >
                                    Clear chat
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray "
                                    onClick={() => {
                                        setMenuOpen(false);
                                        if (window.confirm('Are you sure you want to delete this chat and all its messages?')) {
                                            deleteChat(activeChatId);
                                        }
                                    }}
                                    disabled={!activeChatId}
                                >
                                    Delete this chat
                                </button>
                                {/* Select chats option removed */}
                            </div>
                        )}
                    </div>
                </div>
                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 bg-white flex flex-col gap-4">
                    {loading && messages.length === 0 ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-500">{error.message || error.toString()}</div>
                    ) : messages.length === 0 ? (
                        // Show recent messages if available, else show nothing
                        <div className="text-gray-400 text-center mt-10">
                            {(() => {
                                // Find the active chat
                                const chat = chats.find(c => c._id === activeChatId);
                                // If chat has a lastMessage or similar, show up to 3 recent messages
                                if (chat && chat.recentMessages && chat.recentMessages.length > 0) {
                                    return (
                                        <div className="flex flex-col gap-2 items-center">
                                            {chat.recentMessages.slice(-3).map((msg, idx) => (
                                                <div key={msg._id || idx} className="flex items-center gap-2">
                                                    {msg.senderRole === 'agent' && <span className="font-bold text-blue-500">{idx + 1}.</span>}
                                                    <span>{msg.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                // Fallback: show nothing
                                return null;
                            })()}
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <div key={msg._id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'} group`}>
                                    <div className={`relative max-w-xs px-4 py-2 rounded-[12px] shadow transition-none ${msg.senderId === user?.uid ? 'bg-gray' : 'bg-gray'}`}>
                                        <div className="text-base font-medium mb-1">{msg.senderId !== user?.uid && msg.senderName ? msg.senderName : ''}</div>
                                        {/* Edit mode */}
                                        {editingMsgId === msg._id ? (
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    if (editText.trim()) {
                                                        editMessage(msg._id, editText.trim());
                                                        setEditingMsgId(null);
                                                    }
                                                }}
                                                className="flex flex-col gap-1"
                                            >
                                                <input
                                                    className="px-2 py-1 rounded border"
                                                    value={editText}
                                                    onChange={e => setEditText(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 mt-1">
                                                    <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded">Save</button>
                                                    <button type="button" className="px-2 py-1 bg-gray rounded" onClick={() => setEditingMsgId(null)}>Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="text-lg">{msg.text}</div>
                                                <div className="text-xs text-right text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </>
                                        )}
                                        {/* Message menu for user's own messages */}
                                        {msg.senderId === user?.uid && editingMsgId !== msg._id && (
                                            <div className="absolute top-1 right-1 flex items-center">
                                                <button
                                                    className="p-1 rounded-full hover:bg-gray-400 transition-colors"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setMsgMenuOpen(msgMenuOpen === msg._id ? null : msg._id);
                                                    }}
                                                >
                                                    {/* Three dots icon */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <circle cx="5" cy="12" r="1.5" />
                                                        <circle cx="12" cy="12" r="1.5" />
                                                        <circle cx="19" cy="12" r="1.5" />
                                                    </svg>
                                                </button>
                                                {msgMenuOpen === msg._id && (
                                                    <div className="absolute right-0 mt-6 w-28 bg-white border rounded shadow z-20">
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray "
                                                            onClick={() => {
                                                                setEditingMsgId(msg._id);
                                                                setEditText(msg.text);
                                                                setMsgMenuOpen(null);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray  text-red-600"
                                                            onClick={() => {
                                                                setMsgMenuOpen(null);
                                                                if (window.confirm('Delete this message?')) {
                                                                    deleteMessage(msg._id);
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
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
                    className="flex items-center gap-2 p-4 bg-gray border-t"
                >
                    <input
                        name="message"
                        type="text"
                        placeholder="Type your message..."
                        autoComplete="off"
                        className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring"
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                const form = e.target.form;
                                const text = form.elements.message.value;
                                if (text) {
                                    send(text);
                                    form.reset();
                                }
                            }
                        }}
                    />
                    <button type="submit" className="p-2 rounded-full  bg-Blue text-white hover:bg-gray-700 transition-colors flex items-center justify-center" aria-label="Send">
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