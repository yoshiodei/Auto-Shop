import { VehicleData } from '@/lib/types'

interface FilterState {
  category: string 
  minPrice:     number | string
  maxPrice:     number | string
  region:       string
  town:         string
  condition:    { new: boolean; 'slightly used': boolean; used: boolean }
  transmission: { manual: boolean; automatic: boolean }
  fuelType:     { petrol: boolean; diesel: boolean; electric: boolean; hybrid: boolean }
}

type Tab = 'all' | 'car' | 'bike'

export const applyVehicleFilters = (
  vehicles:      VehicleData[],
  appliedFilters: FilterState,
  activeTab:     string,
  isFilterActive: boolean
): VehicleData[] => {

  return vehicles.filter((vehicle) => {

    // 1. Tab always applies regardless of filter state
    if (activeTab !== 'all' && vehicle.category !== activeTab) return false

    // 2. Everything below only applies when a filter has been applied
    if (!isFilterActive) return true

    const {
      minPrice, maxPrice, region, town,
      condition, transmission, fuelType,
    } = appliedFilters

    // Price range — only apply if maxPrice is set
    if (Number(maxPrice) > 0) {
      if (Number(vehicle.price) < Number(minPrice)) return false
      if (Number(vehicle.price) > Number(maxPrice)) return false
    }

    // Region
    if (region && vehicle.location.region?.toLowerCase() !== region.toLowerCase()) return false

    // Town
    if (town && vehicle.location.town?.toLowerCase() !== town.toLowerCase()) return false

    // Condition
    const activeConditions = Object.entries(condition)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (
      activeConditions.length > 0 &&
      !activeConditions.includes(vehicle.condition)
    ) return false

    // Transmission
    const activeTransmissions = Object.entries(transmission)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (
      activeTransmissions.length > 0 &&
      !activeTransmissions.includes(vehicle.transmission)
    ) return false

    // Fuel type
    const activeFuelTypes = Object.entries(fuelType)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (
      activeFuelTypes.length > 0 &&
      !activeFuelTypes.includes(vehicle.fuelType)
    ) return false

    return true
  })
}