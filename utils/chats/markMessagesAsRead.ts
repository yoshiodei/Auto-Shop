import {
  collection, query,
  where, getDocs, writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const markMessagesAsRead = async (
  roomId:   string,
  readerId: string   // the person opening the chat
): Promise<void> => {
  const q = query(
    collection(db, 'chatRooms', roomId, 'messages'),
    where('senderId', '!=', readerId),
    where('isRead',   '==', false)
  );

  const snap  = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((doc) => batch.update(doc.ref, { isRead: true }));
  await batch.commit();
};