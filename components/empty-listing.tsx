import { useRouter } from 'next/navigation'
import { RefreshCw, Plus } from "lucide-react";
import { GlobalState, useAppStore } from '@/store/app-store';

const EmptyListing = () => {
  const router = useRouter();

  const resetFilter = useAppStore((state: GlobalState) => state.resetFilter)

  const handleReload = () => window.location.reload();
  const handleReset = () => {
    useAppStore.getState().resetFilter
    useAppStore.getState().setIsFiltered(false)
  };


  return (
    <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-100 rounded-lg border-2 border-gray-300 mb-6">

      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <circle cx="7.5" cy="8" r="1" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="8" r="1" fill="currentColor" stroke="none" />
          <path d="M9 14.5h6M12 13v3" />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        No listings found
      </h2>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">
        It looks like there’s nothing here yet. Once items are added, they’ll appear in this list.
      </p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleReload}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm border border-gray-300 bg-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-bold"
        >
          <RefreshCw size={14} />
          Reload page
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border-2 border-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-bold"
        >
          <p className='text-gray-700'>Reset Filter</p>
        </button>
      </div>
    </div>
  );
};

export default EmptyListing;