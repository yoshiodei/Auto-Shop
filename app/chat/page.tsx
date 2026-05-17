'use client'

import { useState, useEffect, useRef, useCallback }   from 'react'
import { collection, query, orderBy,
  onSnapshot, doc,
  onSnapshot as docSnapshot }                         from 'firebase/firestore'
import { db }                                         from '@/lib/firebase'
import { useAppStore }                                from '@/store/app-store'
import { getOrCreateChatRoom }                        from '@/utils/chats/getOrCreateChatRoom'
import { sendMessage }                                from '@/utils/chats/sendMessage'
import { useChat }                                    from '@/hooks/useChat'
import { ChatSidebar }                                from '@/app/chat/components/chat-sidebar'
import { ChatHeader }                                 from '@/app/chat/components/chat-header'
import { MessageList }                                from '@/app/chat/components/message-list'
import { MessageInput }                               from '@/app/chat/components/message-input'
import { EmptyChatPanel }                             from '@/app/chat/components/empty-chat-panel'
import { Header }                                     from '@/components/header'
import type { ChatRoom, SelectedUser }                from '@/lib/types'

export default function ChatPage() {
  const user    = useAppStore((state) => state.user)
  const isAdmin = user?.role === 'admin';
  const ADMIN_ID = 'main-admin-id';
  const [roomId,       setRoomId]       = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)
  const [chatRooms,    setChatRooms]    = useState<ChatRoom[]>([])
  const [searchQuery,  setSearchQuery]  = useState('')
  const [messageText,  setMessageText]  = useState('')
  const [sending,      setSending]      = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading } = useChat(roomId, user?.uid ?? '')

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages])

  // Admin — listen to all chat rooms
useEffect(() => {
  if (!isAdmin) return

  const q = query(
    collection(db, 'chatRooms'),
    orderBy('lastMessageAt', 'desc')
  )

  // Track per-room unsubscribe functions for user profile listeners
  const userListeners = new Map<string, () => void>()

  const unsubscribeRooms = onSnapshot(q, (snap) => {
    // Build a fresh map from roomId → room data on every snapshot
    const roomMap = new Map<string, ChatRoom>()

    // Seed the map with current state to avoid flicker
    setChatRooms((prev) => {
      prev.forEach((r) => roomMap.set(r.id, r))
      return prev
    })

    snap.docs.forEach((roomDoc) => {
      const data   = roomDoc.data()
      const roomId = roomDoc.id
      const userId = data.userId

      // Skip if we already have a live listener for this user
      if (!userListeners.has(roomId)) {
        const unsubscribeUser = docSnapshot(
          doc(db, 'users', userId),
          (userSnap) => {
            const u = userSnap.data()

            // Update only this specific room in state — don't rebuild the whole array
            setChatRooms((prev) => {
              const exists = prev.find((r) => r.id === roomId)
              const updated: ChatRoom = {
                id:            roomId,
                userId,
                lastMessage:   data.lastMessage   ?? null,
                lastMessageAt: data.lastMessageAt ?? null,
                fullName:      u?.fullName  ?? 'Unknown User',
                photoURL:      u?.photoURL  ?? null,
                isOnline:      u?.isOnline  ?? false,
                lastSeen:      u?.lastSeen  ?? null,
              }

              if (exists) {
                // Replace the existing room in place
                return prev.map((r) => r.id === roomId ? updated : r)
              }

              // New room — append it
              return [...prev, updated]
            })
          }
        )

        // Store the unsubscribe so we don't create duplicate listeners
        userListeners.set(roomId, unsubscribeUser)
      } else {
        // Room already has a listener — just update lastMessage and lastMessageAt
        setChatRooms((prev) =>
          prev.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  lastMessage:   data.lastMessage   ?? r.lastMessage,
                  lastMessageAt: data.lastMessageAt ?? r.lastMessageAt,
                }
              : r
          )
        )
      }
    })

    // Clean up listeners for rooms that no longer exist
    const activeRoomIds = new Set(snap.docs.map((d) => d.id))
    userListeners.forEach((unsub, roomId) => {
      if (!activeRoomIds.has(roomId)) {
        unsub()
        userListeners.delete(roomId)
      }
    })
  })

  return () => {
    unsubscribeRooms()
    userListeners.forEach((unsub) => unsub())
    userListeners.clear()
  }
}, [isAdmin])

  // User — auto create/load room with admin
  useEffect(() => {
    if (!user || isAdmin) return

    const init = async () => {
      const id = await getOrCreateChatRoom(user.uid)
      setRoomId(id)

      return docSnapshot(doc(db, 'users', ADMIN_ID), (snap) => {
        const data = snap.data()
        setSelectedUser({
          uid:      ADMIN_ID,
          fullName: data?.fullName ?? 'Support',
          photoURL: data?.photoURL ?? null,
          isOnline: data?.isOnline ?? false,
          lastSeen: data?.lastSeen ?? null,
        })
      })
    }

    init()
  }, [user, isAdmin])

  const handleSelectRoom = (room: ChatRoom) => {
    setRoomId(room.id)
    setSelectedUser({
      uid:      room.userId,
      fullName: room.fullName,
      photoURL: room.photoURL,
      isOnline: room.isOnline,
      lastSeen: room.lastSeen,
    })
  }

  const handleSend = async () => {
    if (!roomId || !user || !messageText.trim()) return
    setSending(true)
    try {
      await sendMessage({ roomId, senderId: user.uid, text: messageText })
      setMessageText('')
      scrollToBottom()
    } finally {
      setSending(false)
    }
  }

  const filteredRooms = chatRooms.filter((room) =>
    room.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Please sign in to use chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          isAdmin={isAdmin}
          chatRooms={filteredRooms}
          selectedUser={selectedUser}
          roomId={roomId}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onSelectRoom={handleSelectRoom}
        />

        {selectedUser ? (
          <div className="hidden md:flex flex-1 flex-col bg-white">
            <ChatHeader selectedUser={selectedUser} />
            <MessageList
              messages={messages}
              isLoading={isLoading}
              currentUserId={user.uid}
              bottomRef={bottomRef as React.RefObject<HTMLDivElement>}
            />
            <MessageInput
              value={messageText}
              onChange={setMessageText}
              onSend={handleSend}
              sending={sending}
            />
          </div>
        ) : (
          <EmptyChatPanel isAdmin={isAdmin} />
        )}
      </div>
    </div>
  )
}