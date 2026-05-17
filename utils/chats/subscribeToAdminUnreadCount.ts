import {
  collection, query, where,
  onSnapshot, collectionGroup
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const subscribeToAdminUnreadCount = (
  adminId:  string,
  callback: (count: number) => void
): (() => void) => {

  // collectionGroup queries across ALL chatRooms/*/messages at once
  const q = query(
    collectionGroup(db, 'messages'),
    where('senderId', '!=', adminId),
    where('isRead',   '==', false)
  )

  return onSnapshot(q, (snap) => {
    callback(snap.size)
  })
}