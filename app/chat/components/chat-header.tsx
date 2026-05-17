'use client'

// import { formatDate }  from '@/lib/utils/formatDate'
import { getInitials } from '@/utils/getInitials'
import type { SelectedUser } from '@/lib/types'
import { timeAgo } from '@/utils/timeAgo'

interface Props {
  selectedUser: SelectedUser
}

export function ChatHeader({ selectedUser }: Props) {

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">

        <div className="relative">
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
          <h2 className="font-semibold text-gray-900">{selectedUser.fullName}</h2>
          {selectedUser.isOnline ? (
            <p className="text-xs text-green-500 font-medium">Active now</p>
          ) : (
            <p className="text-xs text-gray-500">
              Last seen {selectedUser.lastSeen ? timeAgo(selectedUser.lastSeen) : 'a while ago'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}