import { useEffect }                          from 'react'
import { useAppStore }                       from '@/store/app-store'
import { getOrCreateChatRoom }                from '@/utils/chats/getOrCreateChatRoom'
import { subscribeToAdminUnreadCount }        from '@/utils/chats/subscribeToAdminUnreadCount'
import { subscribeToUserUnreadCount }         from '@/utils/chats/subscribeToUserUnreadCount'

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID!

export const useChatUnreadCount = () => {
  const user                           = useAppStore((state) => state.user)
  const setUnreadCount = useAppStore((state) => state.setUnreadChatCount)
  const setRoomId = useAppStore((state) => state.setRoomId)

  useEffect(() => {
    if (!user) return

    let unsubscribe: (() => void) | null = null

    const init = async () => {
      if (user.uid === ADMIN_ID) {
        // Admin — listen across all chat rooms
        unsubscribe = subscribeToAdminUnreadCount(user.uid, (count) => {
          setUnreadCount(count)
        })
      } else {
        // Regular user — listen to their single room with admin
        const id = await getOrCreateChatRoom(user.uid)
        setRoomId(id)

        unsubscribe = subscribeToUserUnreadCount(id, user.uid, (count) => {
          setUnreadCount(count)
        })
      }
    }

    init()

    return () => {
      unsubscribe?.()
      setUnreadCount(0)
    }
  }, [user?.uid])
}