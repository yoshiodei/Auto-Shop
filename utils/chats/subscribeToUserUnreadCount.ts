import {
  collection, query,
  where, onSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const subscribeToUserUnreadCount = (
  roomId:   string,
  userId:   string,
  callback: (count: number) => void
): (() => void) => {
  const q = query(
    collection(db, 'chatRooms', roomId, 'messages'),
    where('senderId', '!=', userId),
    where('isRead',   '==', false)
  )

  return onSnapshot(q, (snap) => {
    callback(snap.size)
  })
}