// Messaging service functions
// Handles sending messages, creating chats, and fetching conversations

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from './init';
import { COLLECTIONS } from './config';

// Type definitions
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  chatId: string;
  text: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSenderId: string;
  unreadCount: { [key: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'like' | 'view' | 'sold' | 'review';
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

// Send a message
export const sendMessage = async (
  senderId: string,
  senderName: string,
  receiverId: string,
  chatId: string,
  text: string,
  attachments?: string[]
): Promise<string> => {
  try {
    const messageData: Omit<Message, 'id'> = {
      senderId,
      senderName,
      receiverId,
      chatId,
      text,
      attachments: attachments || [],
      read: false,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), messageData);

    // Update chat's last message
    await updateDoc(doc(db, COLLECTIONS.CHATS, chatId), {
      lastMessage: text,
      lastMessageTime: new Date(),
      lastMessageSenderId: senderId,
      updatedAt: new Date(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send message');
  }
};

// Get or create chat
export const getOrCreateChat = async (
  user1Id: string,
  user1Name: string,
  user2Id: string,
  user2Name: string
): Promise<string> => {
  try {
    // Check if chat already exists
    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', user1Id)
    );

    const querySnapshot = await getDocs(q);
    let chatId: string | null = null;

    querySnapshot.forEach((doc) => {
      const chat = doc.data() as Chat;
      if (chat.participants.includes(user2Id)) {
        chatId = doc.id;
      }
    });

    if (chatId) {
      return chatId;
    }

    // Create new chat
    const chatData: Omit<Chat, 'id'> = {
      participants: [user1Id, user2Id],
      participantNames: [user1Name, user2Name],
      lastMessage: '',
      lastMessageTime: new Date(),
      lastMessageSenderId: '',
      unreadCount: {
        [user1Id]: 0,
        [user2Id]: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.CHATS), chatData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get or create chat');
  }
};

// Get user's chats
export const getUserChats = async (userId: string): Promise<Chat[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const chats: Chat[] = [];

    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        ...doc.data(),
      } as Chat);
    });

    return chats;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch chats');
  }
};

// Get chat messages
export const getChatMessages = async (
  chatId: string,
  pageLimit: number = 50
): Promise<Message[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );

    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      } as Message);
    });

    return messages.reverse();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch messages');
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.MESSAGES, messageId), {
      read: true,
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark message as read');
  }
};

// Mark all chat messages as read
export const markChatAsRead = async (chatId: string, userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('chatId', '==', chatId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { read: true });
    });

    // Update chat unread count
    await updateDoc(doc(db, COLLECTIONS.CHATS, chatId), {
      [`unreadCount.${userId}`]: 0,
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark chat as read');
  }
};

// Create notification
export const createNotification = async (
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  relatedId?: string
): Promise<string> => {
  try {
    const notificationData: Omit<Notification, 'id'> = {
      userId,
      type,
      title,
      message,
      relatedId,
      read: false,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), notificationData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create notification');
  }
};

// Get user notifications
export const getUserNotifications = async (
  userId: string,
  unreadOnly: boolean = false
): Promise<Notification[]> => {
  try {
    let q;
    
    if (unreadOnly) {
      q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        where('read', '==', false),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];

    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification);
    });

    return notifications;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch notifications');
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), {
      read: true,
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark notification as read');
  }
};
