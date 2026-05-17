import {
  collection, query, where,
  getDocs, addDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMIN_ID = "main-admin-id"; // This should match the adminId used when creating chat rooms

export const getOrCreateChatRoom = async (userId: string): Promise<string> => {
  const roomsRef = collection(db, 'chatRooms');
  const q        = query(
    roomsRef,
    where('userId',  '==', userId),
    where('adminId', '==', ADMIN_ID)
  );

  const snap = await getDocs(q);

  if (!snap.empty) return snap.docs[0].id; // room already exists

  // Create a new room
  const newRoom = await addDoc(roomsRef, {
    userId,
    adminId:      ADMIN_ID,
    createdAt:    serverTimestamp(),
    lastMessage:  null,
    lastMessageAt: null,
  });

  return newRoom.id;
};