const STORAGE_KEY = 'viewed_vehicles';

// For logged in users — check by userId + vehicleId
export const hasViewedVehicleAsUser = (
  userId: string,
  vehicleId: string
): boolean => {
  const viewed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  return !!viewed[`${userId}_${vehicleId}`];
};

// For anonymous users — check by vehicleId only (device-based)
export const hasViewedVehicleAsAnon = (vehicleId: string): boolean => {
  const viewed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  return !!viewed[`anon_${vehicleId}`];
};

// Mark as viewed in localStorage so it won't be counted again
export const markVehicleAsViewed = (
  vehicleId: string,
  userId?: string
): void => {
  const viewed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  const key    = userId ? `${userId}_${vehicleId}` : `anon_${vehicleId}`;
  viewed[key]  = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
};