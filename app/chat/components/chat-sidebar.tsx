'use client'

import { Search as SearchIcon, MessageCircle } from 'lucide-react'
// import { formatDate }  from '@/lib/utils/formatDate'
import { getInitials } from '@/utils/getInitials'
import type { ChatRoom, SelectedUser } from '@/lib/types'
import { timeAgo } from '@/utils/timeAgo'

interface Props {
  isAdmin:      boolean
  chatRooms:    ChatRoom[]
  selectedUser: SelectedUser | null
  roomId:       string | null
  searchQuery:  string
  onSearch:     (query: string) => void
  onSelectRoom: (room: ChatRoom) => void
}

export function ChatSidebar({
  isAdmin,
  chatRooms,
  selectedUser,
  roomId,
  searchQuery,
  onSearch,
  onSelectRoom,
}: Props) {
  return (
    <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">

      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 mt-2 mb-2">
          {isAdmin ? 'All chats' : 'Messages'}
        </h2>

        {isAdmin && (
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Admin — list of all user rooms */}
        {isAdmin && (
          chatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <MessageCircle className="w-10 h-10 text-gray-100 mb-2" />
              <p className="text-sm text-gray-400">No chats found</p>
            </div>
          ) : (
            chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  roomId === room.id ? 'bg-gray-50 border-l-2 border-l-[#FF6B7A]' : ''
                }`}
              >
                <div className="flex items-start gap-3">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {room.photoURL ? (
                      <img
                        src={room.photoURL}
                        alt={room.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#FF6B7A]">
                          {getInitials(room.fullName)}
                        </span>
                      </div>
                    )}
                    {room.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">{room.fullName}</h3>
                      <span className="text-xs text-gray-500">
                        {room.lastMessageAt ? timeAgo(room.lastMessageAt) : ''}
                      </span>
                    </div>
                    {room.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {room.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )
        )}

        {/* User — only admin/support */}
        {!isAdmin && selectedUser && (
          <button className="w-full p-4 border-b border-gray-100 bg-gray-50 border-l-2 border-l-[#FF6B7A] text-left">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {selectedUser.photoURL ? (
                  <img
                    src={selectedUser.photoURL}
                    alt={selectedUser.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FF6B7A]/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#FF6B7A]">
                      {getInitials(selectedUser.fullName)}
                    </span>
                  </div>
                )}
                {selectedUser.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedUser.fullName}</h3>
                <p className="text-xs text-gray-500">Support</p>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}