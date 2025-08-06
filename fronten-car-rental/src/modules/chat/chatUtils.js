// Helper functions for chat module

import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Check if a user is a participant in a chat
export function isParticipant(chat, userId) {
    return chat.participants && chat.participants.includes(userId);
}

// Format a message timestamp
export function formatTimestamp(ts) {
    const date = new Date(ts);
    return date.toLocaleString();
}

// Filter chats for a user
export function filterChatsForUser(chats, userId) {
    return chats.filter(chat => isParticipant(chat, userId));
}

export async function getAgentNameById(agentId) {
    if (!agentId) return null;
    try {
        const agentDoc = await getDoc(doc(db, 'agent', agentId));
        if (agentDoc.exists()) {
            return agentDoc.data().name || null;
        }
        return null;
    } catch (err) {
        console.error('Error fetching agent name:', err);
        return null;
    }
}

export async function getCustomerNameById(userId) {
    if (!userId) return null;
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().name || null;
        }
        return null;
    } catch (err) {
        console.error('Error fetching customer name:', err);
        return null;
    }
} 