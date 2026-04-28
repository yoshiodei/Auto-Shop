import {
  hasViewedVehicleAsUser,
  hasViewedVehicleAsAnon,
  markVehicleAsViewed,
} from './hasViewedVehicle';
import { incrementViewCount } from './incrementViewCount';
import { recordViewLog }      from './recordViewLog';

type TrackViewPayload = {
  vehicleId: string;
  userId?:   string; // undefined if anonymous
};

export const trackVehicleView = async ({
  vehicleId,
  userId,
}: TrackViewPayload): Promise<void> => {
  const isAnon = !userId;

  // Check if already viewed on this device
  const alreadyViewed = isAnon
    ? hasViewedVehicleAsAnon(vehicleId)
    : hasViewedVehicleAsUser(userId!, vehicleId);

  if (alreadyViewed) return; // already counted — do nothing

  try {
    // 1. Increment viewCount on the vehicle doc
    await incrementViewCount(vehicleId);

    // 2. Log the view in the subcollection
    await recordViewLog({ vehicleId, userId, isAnon });

    // 3. Mark as viewed in localStorage to prevent duplicates
    markVehicleAsViewed(vehicleId, userId);
  } catch (error: any) {
    // Don't surface view tracking errors to the user
    console.error('Failed to track view:', error.message);
  }
};