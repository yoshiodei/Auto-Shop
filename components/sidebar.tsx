'use client'

import { ChevronDown, Fuel } from 'lucide-react'
import { GlobalState, useAppStore } from '@/store/app-store'
import PriceRangeSlider from './price-range-slider'
import VehicleLocation from './vehicle-location'
import ConditionSelection from './condition-selection'
import TransmissionSelection from './transmission-selection'
import FuelTypeSelection from './fuel-type-selection'
import { use } from 'react'

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {

  const reset = useAppStore((state: GlobalState) => state.resetFilter)
  const setIsFiltered = useAppStore((state) => state.setIsFiltered)

  const handleApply = () => {
    console.log("Filters applied");
    setIsFiltered(true);
  };

  const handleReset = () => {
    console.log("Filters reset");
    reset();
    setIsFiltered(false);
  };

  return (
    <aside className={isMobile ? "w-full bg-white" : "w-56 lg:w-64 bg-gray-50 p-3 lg:p-6 border-r border-gray-200 overflow-y-auto max-h-screen hidden md:block"}>
      <div className="space-y-6">
        

        <PriceRangeSlider />
        <VehicleLocation />
        <ConditionSelection />
        <TransmissionSelection />
        <FuelTypeSelection />

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleApply}
            className="w-full bg-[#FF6B7A] hover:bg-[#FF5566] text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  )
}
