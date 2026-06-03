import {
  doc,
  collection, getDocs,
  writeBatch, deleteDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const deleteNotification = async (
  userId:         string,
  notificationId: string
): Promise<void> => {
  await deleteDoc(
    doc(db, 'users', userId, 'notifications', notificationId)
  )
}

export const deleteAllNotifications = async (userId: string): Promise<void> => {
  const snap  = await getDocs(collection(db, 'users', userId, 'notifications'))
  const batch = writeBatch(db)

  snap.docs.forEach((doc) => batch.delete(doc.ref))

  await batch.commit()
}