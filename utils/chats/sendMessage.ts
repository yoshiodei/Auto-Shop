import {
  collection, addDoc,
  doc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

type SendMessagePayload = {
  roomId:   string;
  senderId: string;
  text:     string;
};

export const sendMessage = async ({
  roomId,
  senderId,
  text,
}: SendMessagePayload): Promise<void> => {
  const trimmed = text.trim();
  if (!trimmed) return;

  const messageData = {
    senderId,
    text:      trimmed,
    isRead:    false,
    createdAt: serverTimestamp(),
  };


  // Add message to subcollection
  await addDoc(collection(db, 'chatRooms', roomId, 'messages'), messageData);

  // Update last message on the room doc for sorting
  await updateDoc(doc(db, 'chatRooms', roomId), {
    lastMessage:   trimmed,
    lastMessageAt: serverTimestamp(),
  });
};