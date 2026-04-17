'use client'

import { Header } from '@/components/header'
import { Bell, Check, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: number
  title: string
  description: string
  timestamp: string
  read: boolean
  type: 'sale' | 'message' | 'alert'
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'New vehicle listed',
    description: 'A new 2020 Toyota Camry has been listed in Accra matching your search criteria',
    timestamp: '2 hours ago',
    read: false,
    type: 'sale'
  },
  {
    id: 2,
    title: 'Price drop alert',
    description: 'The Honda CR-V you viewed has dropped by ₵500. Check it out now!',
    timestamp: '5 hours ago',
    read: false,
    type: 'alert'
  },
  {
    id: 3,
    title: 'Message from John Mensah',
    description: 'Interested in your inquiry about the Ford Explorer. Reply to continue conversation.',
    timestamp: '1 day ago',
    read: true,
    type: 'message'
  },
  {
    id: 4,
    title: 'Your listing is live',
    description: 'Your BMW X5 listing is now visible to all buyers on Auto World',
    timestamp: '2 days ago',
    read: true,
    type: 'sale'
  },
  {
    id: 5,
    title: 'Weekly digest',
    description: 'You have 12 new vehicles matching your saved searches',
    timestamp: '3 days ago',
    read: true,
    type: 'alert'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS)

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-blue-100 text-blue-700'
      case 'message': return 'bg-green-100 text-green-700'
      case 'alert': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-[#FF6B7A]" />
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            </div>
            <p className="text-gray-600">You have {notifications.filter(n => !n.read).length} unread notifications</p>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 transition-colors ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-[#FF6B7A]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#FF6B7A] rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{notification.description}</p>
                      <p className="text-gray-500 text-xs">{notification.timestamp}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-[#FF6B7A] transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
