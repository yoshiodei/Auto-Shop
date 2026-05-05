import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';
// import { useNotificationStore } from '@/hooks/useNotifications'

export const useNotifications = () => {
  const user = useAppStore((state) => state.user);
  const subscribeToNotifications = useAppStore((state) => state.subscribeToNotifications);
  const clearNotifications = useAppStore((state) => state.clearNotifications);

  useEffect(() => {
    if (!user) return;

    // Start real-time listener and store the unsubscribe function
    const unsubscribe = subscribeToNotifications(user.uid);

    // Clean up listener on logout or unmount
    return () => {
      unsubscribe();
      clearNotifications();
    };
  }, [user?.uid]);
};