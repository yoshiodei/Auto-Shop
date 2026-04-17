import React from 'react'
import { useAppStore, GlobalState } from '@/store/app-store';

export default function FuelTypeSelection() {

  const fuelTypeFilters = useAppStore((state: GlobalState) => state.filter.fuelType);
  const setFuelTypeFilter = useAppStore((state: GlobalState) => state.setFuelType);

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <p className="mb-4 text-md font-semibold tracking-widest text-gray-900">
        Fuel Type
      </p>
      <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fuelTypeFilters.petrol}
                onChange={() => setFuelTypeFilter('petrol')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Petrol</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fuelTypeFilters.diesel}
                onChange={() => setFuelTypeFilter('diesel')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Diesel</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fuelTypeFilters.electric}
                onChange={() => setFuelTypeFilter('electric')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Electric</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fuelTypeFilters.hybrid}
                onChange={() => setFuelTypeFilter('hybrid')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Hybrid</span>
            </label>
          </div>
      
    </div>    
  )
}
