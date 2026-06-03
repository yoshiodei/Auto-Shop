'use client'

import { useEffect, useRef }               from 'react'
import {
  collection, query,
  where, onSnapshot, collectionGroup
}                                          from 'firebase/firestore'
import { db }                              from '@/lib/firebase'
import { useAppStore }                     from '@/store/app-store'
import { getOrCreateChatRoom }             from '@/utils/chats/getOrCreateChatRoom'

const ADMIN_ID = 'main-admin-id'


export const useAppListeners = () => {

  const user                     = useAppStore((state) => state.user)
  const subscribeToNotifications = useAppStore((state) => state.subscribeToNotifications)
  const clearNotifications       = useAppStore((state) => state.clearNotifications)
  const setChatUnreadCount       = useAppStore((state) => state.setChatUnreadCount)
  const clearChatUnread          = useAppStore((state) => state.clearChatUnread)

  const notifUnsubRef = useRef<(() => void) | null>(null)
  const chatUnsubRef  = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!user) {
      // Clean up all listeners on logout
      notifUnsubRef.current?.()
      chatUnsubRef.current?.()
      clearNotifications()
      clearChatUnread()
      return
    }

    // 1. Notifications listener
    notifUnsubRef.current = subscribeToNotifications(user.uid)

    // 2. Chat unread count listener
    const initChatListener = async () => {
      if (user.uid === ADMIN_ID) {
        // Admin — watch unread across all rooms
        const q = query(
          collectionGroup(db, 'messages'),
          where('senderId', '!=', user.uid),
          where('isRead',   '==', false)
        )
        chatUnsubRef.current = onSnapshot(q, (snap) => {
          setChatUnreadCount(snap.size)
        })
      } else {
        // Regular user — watch their single room
        const roomId = await getOrCreateChatRoom(user.uid)
        const q      = query(
          collection(db, 'chatRooms', roomId, 'messages'),
          where('senderId', '!=', user.uid),
          where('isRead',   '==', false)
        )
        chatUnsubRef.current = onSnapshot(q, (snap) => {
          setChatUnreadCount(snap.size)
        })
      }
    }

    initChatListener()

    return () => {
      notifUnsubRef.current?.()
      chatUnsubRef.current?.()
    }
  }, [user?.uid])
}