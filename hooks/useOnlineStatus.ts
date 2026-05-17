import { useEffect }          from 'react';
import { setUserOnline, setUserOffline } from '@/utils/chats/updateOnlineStatus';
import { useAppStore } from '@/store/app-store';

export const useOnlineStatus = () => {
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    setUserOnline(user.uid);

    // Set offline on tab close
    const handleOffline = () => setUserOffline(user.uid);
    window.addEventListener('beforeunload', handleOffline);

    return () => {
      setUserOffline(user.uid);
      window.removeEventListener('beforeunload', handleOffline);
    };
  }, [user?.uid]);
};