'use client';

import { useRouter }              from 'next/navigation';
import { Bell }                   from 'lucide-react';

import { useAppStore } from '@/store/app-store';

const NotificationIcon = () => {
  const router       = useRouter();
  const unreadCount = useAppStore((state) => state.notificationUnreadCount);

  return (
    <button
      onClick={() => router.push('/notifications')}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
      aria-label="Notifications"
    >
      <Bell size={22} className="text-gray-700" />

      {unreadCount > 0 && (
        <span className="absolute bg-red-500 text-white px-1 rounded-full text-xs top-0 left-0 font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationIcon;