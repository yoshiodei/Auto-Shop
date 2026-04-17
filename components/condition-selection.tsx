import React, { use } from 'react'
import { useAppStore, GlobalState } from '@/store/app-store';

export default function ConditionSelection() {

  const conditionFilters = useAppStore((state: GlobalState) => state.filter.condition);
    const setConditionFilter = useAppStore((state: GlobalState) => state.setCondition);  

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <p className="mb-4 text-md font-semibold tracking-widest text-gray-900">
        Condition
      </p>
      <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={conditionFilters.new}
                onChange={() => setConditionFilter('new')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">New</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={conditionFilters['slightly used']}
                onChange={() => setConditionFilter('slightly used')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Slightly Used</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={conditionFilters.used}
                onChange={() => setConditionFilter('used')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
              />
              <span className="text-sm text-gray-700">Used</span>
            </label>
          </div>
      
    </div>    
  )
}
