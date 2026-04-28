import { GlobalState, useAppStore } from '@/store/app-store';
import React, { use } from 'react'

interface Location {
  [region: string]: string[];
}

export default function VehicleLocation() {

  const region = useAppStore((state: GlobalState) => state.filter.region);
  const town = useAppStore((state: GlobalState) => state.filter.town);
  const setLocationFilter = useAppStore((state: GlobalState) => state.setLocation);

  const setIsFiltered = useAppStore((state) => state.setIsFiltered);

  const handleSetLocationFilter = (region: string, town: string) => {
    setIsFiltered(false);
    setLocationFilter(region, town);
  }

  const location: Location = {
    'Greater Accra': ['Accra','Kaneshie', 'Lapaz', 'Awoshie', 'Tema', 'Madina', 'Kasoa', 'Spintex', 'Nungua', 'Teshie', 'Ashaiman', 'Adenta', 'Amasaman'],
    'Ashanti': ['Kumasi', 'Obuasi', 'Ejisu', 'Asokwa', 'Asawase', 'Manhyia', 'Bantama', 'Suame', 'Tafo', 'Nhyiaeso'],
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <p className="mb-4 text-md font-semibold tracking-widest text-gray-900">
        Location
      </p>

      <div className="space-y-6 mb-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => handleSetLocationFilter(e.target.value, town)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
          >
            <option value="">All regions</option>
            {Object.keys(location).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Town
          </label>
          <select
            value={town}
            onChange={(e) => handleSetLocationFilter(region, e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
          >
            <option value="">All towns</option>
            {location[region]?.map((t: string) => (
              <option key={t} value={t}>{t}</option>
            )) }
          </select>
        </div>
      </div>  
    </div>    
  )
}
