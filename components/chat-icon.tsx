'use client'

import { useRouter }    from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

export function ChatIcon() {
  const router      = useRouter()
  // const unreadCount = useAppStore((state) => state.unreadChatCount)
  const chatUnreadCount  = useAppStore((state) => state.chatUnreadCount)

  return (
    <button
      onClick={() => router.push('/chat')}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Chat"
    >
      <MessageCircle className="w-5 h-5 text-gray-600" />

      {chatUnreadCount > 0 && (
        <span className="absolute bg-red-500 text-white px-1 rounded-full text-xs top-0 left-0 font-bold">
          {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
        </span>
      )}
    </button>
  )
}