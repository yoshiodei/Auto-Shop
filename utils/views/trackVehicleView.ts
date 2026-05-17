import {
  hasViewedVehicleAsUser,
  hasViewedVehicleAsAnon,
  markVehicleAsViewed,
} from './hasViewedVehicle';
import { addViewerId, getAnonId } from './addViewerId';
import { recordViewLog }          from './recordViewLog';

type TrackViewPayload = {
  vehicleId: string;
  userId?:   string;
};

export const trackVehicleView = async ({
  vehicleId,
  userId,
}: TrackViewPayload): Promise<void> => {
  const isAnon   = !userId;
  const viewerId = isAnon ? getAnonId() : userId!;

  // Check localStorage first to avoid unnecessary Firestore reads
  const alreadyViewed = isAnon
    ? hasViewedVehicleAsAnon(vehicleId)
    : hasViewedVehicleAsUser(userId!, vehicleId);

  if (alreadyViewed) return;

  try {
    // 1. Add viewerId to the viewers array on the vehicle doc
    await addViewerId(vehicleId, viewerId);

    // 2. Log the view in the subcollection
    await recordViewLog({ vehicleId, viewerId, isAnon });

    // 3. Mark in localStorage to prevent re-tracking on refresh
    markVehicleAsViewed(vehicleId, userId);
  } catch (error: any) {
    console.error('Failed to track view:', error.message);
  }
};