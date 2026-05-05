import {
  doc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Mark a single notification as read
export const markAsRead = async (
  userId: string,
  notificationId: string
): Promise<void> => {
  await updateDoc(
    doc(db, 'users', userId, 'notifications', notificationId),
    { isRead: true }
  );
};

// Mark all notifications as read in one batch
export const markAllAsRead = async (userId: string): Promise<void> => {
  const snap  = await getDocs(collection(db, 'users', userId, 'notifications'));
  const batch = writeBatch(db);

  snap.docs
    .filter((doc) => !doc.data().isRead)
    .forEach((doc) => batch.update(doc.ref, { isRead: true }));

  await batch.commit();
};