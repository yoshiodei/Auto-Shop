'use client'

import { MessageCircle } from 'lucide-react'

interface Props {
  isAdmin: boolean
}

export function EmptyChatPanel({ isAdmin }: Props) {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center bg-white">
      <div className="text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">
          {isAdmin
            ? 'Select a chat to start messaging'
            : 'Start a conversation with support'}
        </p>
      </div>
    </div>
  )
}