'use client'

import { Send } from 'lucide-react'

interface Props {
  value:    string
  onChange: (text: string) => void
  onSend:   () => void
  sending:  boolean
}

export function MessageInput({ value, onChange, onSend, sending }: Props) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSend()
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}