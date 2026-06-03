'use client';

import { useState }                          from 'react';
import { useRouter }                         from 'next/navigation';
import { Bell, ArrowRight, CheckCheck, Trash2 }      from 'lucide-react';
import { markAsRead, markAllAsRead }         from '@/utils/notifications/markNotificationAsRead';
import { timeAgo }                        from '@/utils/timeAgo';
import { Button }                            from '@/components/ui/button';
import type { Notification }                 from '@/lib/types';
import { useAppStore } from '@/store/app-store';
import LoadingScreen from '@/components/loading-screen';
import { Header } from '@/components/header';
import { NotificationModal } from '@/components/modals/view-notification';
import { DeleteNotificationsModal } from '@/components/modals/delete-all-notifications';

type Tab = 'all' | 'unread' | 'read';

const tabs: { label: string; value: Tab }[] = [
  { label: 'All',    value: 'all'    },
  { label: 'Unread', value: 'unread' },
  { label: 'Read',   value: 'read'   },
];

const NotificationsPage = () => {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const notifications = useAppStore((state) => state.notifications);
  const onModalOpen = useAppStore((state) => state.setModalOpen);
  const isLoading = useAppStore((state) => state.isLoadingNotification);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deleteNotificationsModalOpen, setDeleteNotificationsModalOpen] = useState(false);

  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'read')   return n.isRead;
    return true;
  });

  const handleMarkAsRead = async (notification: Notification) => {
    if (!user || notification.isRead) return;
    await markAsRead(user.uid, notification.id);
  };

  const handleOpenNotification = (notification: Notification) => {
    if(!user) {
      onModalOpen();
      return;
    } else {      
      setSelectedNotification(notification);
      setNotificationModalOpen(true);
    } 
  }

  const handleDeleteAllNotifications = async () => {
    if(!user) {
      onModalOpen();
      return;
    } else {
      setDeleteNotificationsModalOpen(true);
    } 
  }

  const handleMarkAllAsRead = async () => {
    if (!user || !unreadCount) return;
    setMarkingAll(true);
    try {
      await markAllAsRead(user.uid);
    } finally {
      setMarkingAll(false);
    }
  };

  // ── Not logged in ──────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <Bell size={40} className="text-gray-300 mb-4" />
        <p className="text-gray-900 font-medium text-lg">Sign in to view notifications</p>
        <p className="text-gray-500 text-sm mt-2">
          You need to be logged in to see your notifications.
        </p>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────
  if (isLoading) {
    return(
      <LoadingScreen />
    )
  }

  return (
    <>
    <Header />
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              variant="secondary"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
            >
              <CheckCheck size={16} />
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </Button>
          )}
          {unreadCount > 0 && (
            <Button
              onClick={handleDeleteAllNotifications}
              disabled={markingAll}
              variant="secondary"
              className="flex items-center gap-2 bg-[#FF6B7A] hover:bg-[#ff5261] text-white text-sm"
            >
              <Trash2 size={16} />
              {deletingAll ? 'Deleting...' : 'Delete all'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const count =
            tab.value === 'unread' ? notifications.filter((n) => !n.isRead).length :
            tab.value === 'read'   ? notifications.filter((n) =>  n.isRead).length :
            notifications.length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-[#FF6B7A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value
                  ? 'bg-white text-[#FF6B7A]'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <hr />
      <br />

      {/* Empty state */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={36} className="text-gray-300 mb-3" />
          <p className="text-gray-900 font-medium">
            {activeTab === 'unread' ? 'No unread notifications' :
             activeTab === 'read'   ? 'No read notifications'   :
             'No notifications yet'}
          </p>
          <p className="text-gray-500 text-sm mt-1.5">
            {activeTab === 'all'
              ? 'New vehicle listings will show up here.'
              : 'Switch to another tab to see your notifications.'}
          </p>
        </div>
      ) : (

        // Notification list
        <div className="flex flex-col gap-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleMarkAsRead(notification)}
              className={`relative flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                !notification.isRead
                  ? 'bg-red-50/60 border-red-100'
                  : 'bg-white border-gray-100'
              }`}
              style={!notification.isRead ? { backgroundColor: '#ffefef78', borderColor: '#f6a9a9' } : {backgroundColor: 'white'}}
            >
              {/* Unread dot */}
              {!notification.isRead && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#FF6B7A]" />
              )}

              {/* Vehicle thumbnail */}
              {notification.imageUrl ? (
                <img
                  src={notification.imageUrl}
                  alt=""
                  className="rounded-lg object-cover shrink-0 border border-gray-200"
                  style={{width: 160, height: 85}}
                />
              ) : (
                <div 
                  className=" rounded-lg bg-red-600 flex items-center justify-center"
                  style={{backgroundColor: 'lightgray', width: 160, height: 85}}
                >
                  <Bell size={25} className="text-gray-400" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {notification.createdAt ? timeAgo(notification.createdAt) : 'Just now'}
                </p>

                {/* View vehicle button */}
                {notification.type === 'new_vehicle' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification);
                      handleOpenNotification(notification);
                    }}
                    className="flex items-center gap-1 mt-2.5 text-xs font-medium text-[#FF6B7A] hover:underline"
                  >
                    View vehicle
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <NotificationModal
        isModalOpen={notificationModalOpen}
        onModalClose={() => setNotificationModalOpen(false)}
        notificationData={selectedNotification}
        router={router}
        uid={user?.uid || ''}
      />
      <DeleteNotificationsModal
        isModalOpen={deleteNotificationsModalOpen}
        onModalClose={() => setDeleteNotificationsModalOpen(false)}
        uid={user?.uid || ''}
      />
    </div>
    </>
  );
};

export default NotificationsPage;