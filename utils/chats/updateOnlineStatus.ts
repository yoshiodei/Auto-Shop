import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const setUserOnline = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    isOnline:  true,
    lastSeen:  serverTimestamp(),
  });
};

export const setUserOffline = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    isOnline: false,
    lastSeen: serverTimestamp(),
  });
};