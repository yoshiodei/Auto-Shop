import React, { use } from 'react'
import { useAppStore, GlobalState } from '@/store/app-store';

export default function ConditionSelection() {

  const conditionFilters = useAppStore((state: GlobalState) => state.pendingFilter.condition);
  const pendingFilter = useAppStore((state: GlobalState) => state.pendingFilter);
  const setConditionFilter = useAppStore((state: GlobalState) => state.setPendingFilter);  

  // const setIsFiltered = useAppStore((state) => state.setIsFiltered);

  const handleSetConditionFilter = (condition: 'new' | 'slightly used' | 'used') => {
      // setIsFiltered(false);
      if(conditionFilters[condition]){
        setConditionFilter({ ...pendingFilter, condition: { ...conditionFilters, [condition]: false } });
      }
      else{
        setConditionFilter({ ...pendingFilter, condition: { ...conditionFilters, [condition]: true } });
      }
  };

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
                onChange={() => handleSetConditionFilter('new')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
                style={{ accentColor: "#e2616e" }}
              />
              <span className="text-sm text-gray-700">New</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={conditionFilters['slightly used']}
                onChange={() => handleSetConditionFilter('slightly used')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
                style={{ accentColor: "#e2616e" }}
              />
              <span className="text-sm text-gray-700">Slightly Used</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={conditionFilters.used}
                onChange={() => handleSetConditionFilter('used')}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6B7A] focus:ring-[#FF6B7A]"
                style={{ accentColor: "#e2616e" }}
              />
              <span className="text-sm text-gray-700">Used</span>
            </label>
          </div>
      
    </div>    
  )
}
