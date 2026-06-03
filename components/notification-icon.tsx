'use client';

import { useRouter }              from 'next/navigation';
import { Bell }                   from 'lucide-react';

import { useAppStore } from '@/store/app-store';

const NotificationIcon = () => {
  const router       = useRouter();
  // const unreadCount = useAppStore((state) => state.notificationUnreadCount);

  const notifications    = useAppStore((state) => state.notifications)
  const notifUnreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <button
      onClick={() => router.push('/notifications')}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
      aria-label="Notifications"
    >
      <Bell size={22} className="text-gray-700" />

      {notifUnreadCount > 0 && (
        <span className="absolute bg-red-500 text-white px-1 rounded-full text-xs top-0 left-0 font-bold">
          {notifUnreadCount > 99 ? '99+' : notifUnreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationIcon;