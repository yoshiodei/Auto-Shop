import React from 'react'
import { useAppStore, GlobalState } from '@/store/app-store';

export default function TransmissionSelection() {

  const transmissionFilters = useAppStore((state: GlobalState) => state.filter.transmission);
  const setTransmissionFilter = useAppStore((state: GlobalState) => state.setTransmission);

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <p className="mb-4 text-md font-semibold tracking-widest text-gray-900">
        Transmission
      </p>
      <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={transmissionFilters.manual}
                onChange={() => setTransmissionFilter('manual')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Manual</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={transmissionFilters.automatic}
                onChange={() => setTransmissionFilter('automatic')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Automatic</span>
            </label>
          </div>
      
    </div>    
  )
}
