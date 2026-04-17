'use client'

import { Header } from '@/components/header'
import { MessageCircle, Send, MoreVertical, Search as SearchIcon } from 'lucide-react'
import { useState } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'other'
  timestamp: string
}

interface Chat {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
  avatar: string
  messages: Message[]
}

const SAMPLE_CHATS: Chat[] = [
  {
    id: 1,
    name: 'John Mensah',
    lastMessage: 'The vehicle is in excellent condition. Would you like to schedule a viewing?',
    timestamp: '2:30 PM',
    unread: true,
    avatar: '👨',
    messages: [
      { id: 1, text: 'Hi, I am interested in the Ford Explorer', sender: 'user', timestamp: '10:00 AM' },
      { id: 2, text: 'Great! It is a wonderful vehicle. What would you like to know?', sender: 'other', timestamp: '10:05 AM' },
      { id: 3, text: 'Can you send me more photos?', sender: 'user', timestamp: '10:15 AM' },
      { id: 4, text: 'The vehicle is in excellent condition. Would you like to schedule a viewing?', sender: 'other', timestamp: '2:30 PM' }
    ]
  },
  {
    id: 2,
    name: 'Amelia Boateng',
    lastMessage: 'Thanks for your interest. Let me know if you have any questions.',
    timestamp: '1:15 PM',
    unread: false,
    avatar: '👩',
    messages: [
      { id: 1, text: 'Hi, is the Honda CR-V still available?', sender: 'user', timestamp: '12:00 PM' },
      { id: 2, text: 'Yes, it is still available. Are you interested?', sender: 'other', timestamp: '12:10 PM' },
      { id: 3, text: 'Yes, very much. What is the lowest price?', sender: 'user', timestamp: '12:20 PM' },
      { id: 4, text: 'Thanks for your interest. Let me know if you have any questions.', sender: 'other', timestamp: '1:15 PM' }
    ]
  },
  {
    id: 3,
    name: 'Auto World Support',
    lastMessage: 'We are here to help. Feel free to contact us anytime.',
    timestamp: 'Yesterday',
    unread: false,
    avatar: '🏢',
    messages: [
      { id: 1, text: 'I have a question about a listing', sender: 'user', timestamp: 'Yesterday 3:00 PM' },
      { id: 2, text: 'We are here to help. Feel free to contact us anytime.', sender: 'other', timestamp: 'Yesterday 3:15 PM' }
    ]
  }
]

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(SAMPLE_CHATS)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { id: chat.messages.length + 1, text: newMessage, sender: 'user', timestamp: 'now' }
          ],
          lastMessage: newMessage
        }
      }
      return chat
    })

    setChats(updatedChats)
    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id) || null)
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Sidebar - Chat List */}
        <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{chat.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    </div>
                    <p className={`text-sm truncate ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && <div className="w-2 h-2 bg-[#FF6B7A] rounded-full mt-1 flex-shrink-0"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedChat ? (
          <div className="hidden md:flex flex-1 flex-col bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{selectedChat.avatar}</div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-[#FF6B7A] text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
