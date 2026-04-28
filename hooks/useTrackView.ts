import { useEffect }    from 'react';
import { trackVehicleView } from '@/utils/views/trackVehicleView';
import { useAppStore } from '@/store/app-store';

export const useTrackView = (vehicleId: string) => {
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!vehicleId) return;

    trackVehicleView({
      vehicleId,
      userId: user?.uid, // undefined if not logged in
    });
  }, [vehicleId, user?.uid]);
};