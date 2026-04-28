import { VehicleData } from "@/lib/types";


export const getSimilarVehicles = (
  selectedVehicle: VehicleData,
  allVehicles: VehicleData[],
  limit: number = 4
): VehicleData[] => {
  // Exclude the selected vehicle from the pool
  const pool = allVehicles.filter((v) => v.id !== selectedVehicle.id);

  // 1. Match by brand first
  
    // const brandMatches = pool.filter(
    //   (v) => v?.brand.toLowerCase() === selectedVehicle?.brand.toLowerCase()
    // );
    // if (brandMatches.length >= 1) return brandMatches.slice(0, limit);

    const brandMatches = pool.filter(
      (v) =>
      (v?.brand ?? "").toLowerCase() ===
      (selectedVehicle?.brand ?? "").toLowerCase()
    );

    if (brandMatches.length >= 1) return brandMatches.slice(0, limit);

    // 2. No brand match — try category
    const categoryMatches = pool.filter(
      (v) => v.category === selectedVehicle.category
    );
    if (categoryMatches.length >= 1) return categoryMatches.slice(0, limit);

    // 3. No brand or category match — return whatever is available
    return pool.slice(0, limit);
};