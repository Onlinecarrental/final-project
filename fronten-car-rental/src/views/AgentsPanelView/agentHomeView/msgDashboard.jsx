import React, { useEffect, useState } from 'react';
import BaseCard from "../../../components/card";
import { useNavigate } from "react-router-dom";
import { getUserChats } from '../../../modules/chat/chatApi';
import { getCustomerNameById } from '../../../modules/chat/chatUtils';

const MsgDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerNames, setCustomerNames] = useState({});
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");
        if (!user.uid) return;
        // Fetch all chats for this agent
        const chats = await getUserChats(user.uid, 'agent');
        // Get the latest message from each chat (if any)
        const latestMessages = chats
          .map(chat => {
            const lastMsg = chat.lastMessage || (chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null);
            return lastMsg ? {
              id: lastMsg._id || chat._id,
              chatId: chat._id,
              userId: chat.userId,
              sender: chat.customerName || 'Customer',
              content: lastMsg.text,
              time: lastMsg.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
              unread: lastMsg.unread,
              profileImg: '../src/assets/profile-modified.png'
            } : null;
          })
          .filter(Boolean)
          .sort((a, b) => b.time.localeCompare(a.time));
        setMessages(latestMessages);
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user.uid]);

  // Fetch customer names for messages without a name
  useEffect(() => {
    const fetchNames = async () => {
      const missing = messages.filter(m => !m.sender || m.sender === 'Customer').map(m => m.userId).filter(Boolean);
      for (const userId of missing) {
        if (!customerNames[userId]) {
          const name = await getCustomerNameById(userId);
          if (name) setCustomerNames(prev => ({ ...prev, [userId]: name }));
        }
      }
    };
    if (messages.length > 0) fetchNames();
    // eslint-disable-next-line
  }, [messages]);

  // Function to handle marking a message as read
  const markAsRead = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, unread: false } : msg
    ));
  };

  return (
    <BaseCard
      width="w-full"
      height="full"
      padding="p-6"
      className="mx-auto m-12 border"
    >
      <h1 className="text-center text-2xl font-bold mb-4">Messages</h1>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="space-y-3">
          {messages.slice(0, 5).map((message) => (
            <div
              key={message.id}
              className="bg-gray rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray transition-colors"
              onClick={() => navigate(`/agent/messages?chatId=${message.chatId}`)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full mr-3 bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {(customerNames[message.userId] || message.sender || 'C')[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{customerNames[message.userId] || message.sender}</div>
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">{message.time}</span>
                {message.unread && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    2
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
};

export default MsgDashboard;