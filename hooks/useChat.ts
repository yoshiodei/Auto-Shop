import { useState, useEffect }              from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db }                               from '@/lib/firebase';
import { markMessagesAsRead }               from '@/utils/chats/markMessagesAsRead';

export type Message = {
  id:        string;
  senderId:  string;
  text:      string;
  isRead:    boolean;
  createdAt: any;
};

export const useChat = (roomId: string | null, currentUserId: string) => {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, 'chatRooms', roomId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(msgs);
      setIsLoading(false);

      // Auto mark as read when messages load
      markMessagesAsRead(roomId, currentUserId);
    });

    return () => unsubscribe();
  }, [roomId, currentUserId]);

  return { messages, isLoading };
};