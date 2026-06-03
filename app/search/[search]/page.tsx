// 'use client'

// import { useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { Header } from '@/components/header'
// import { Sidebar } from '@/components/sidebar'
// import { CarCard } from '@/components/car-card'
// import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
// import { GlobalState, useAppStore } from '@/store/app-store'
// import { useState, useMemo } from 'react'
// import { getPriceRangeConfig } from '@/utils/getPriceRangeConfig'


// export default function SearchPage() {
//   const params = useParams()
//   const query = params.search || ''
//   const router = useRouter()
  

//   const vehicleList = useAppStore((state: GlobalState) => state.vehicles)
//   const [priceRange, setPriceRange] = useState<{min: number, max: number, step: number}>({min: 0, max: 500000, step: 1000})
//   const setMaxPrice = useAppStore((state) => state.setMaxPrice)
//   const setMinPrice = useAppStore((state) => state.setMinPrice)


//   const likedCars = 0
//   const toggleLike = false

//   const filteredResults = useMemo(() => {
//     if (typeof query !== 'string') return vehicleList
//     if (!query.trim()) return vehicleList

//     const lowerQuery = query.toLowerCase()
//     return vehicleList.filter(vehicle =>
//       vehicle.title.toLowerCase().includes(lowerQuery) ||
//       vehicle.location.region.toLowerCase().includes(lowerQuery) ||
//       vehicle.location.town.toLowerCase().includes(lowerQuery) ||
//       vehicle.location?.otherTown?.toLowerCase().includes(lowerQuery)
//     )
//   }, [query])

//   console.log('filtered query:!', filteredResults);
  

//   const handleMoreDetails = (carId: number) => {
//     router.push(`/vehicle/${carId}`)
//   }

//   const handleToggleLike = (carId: number) => {
//     // toggleLike(carId)
//   }

//   const updatePriceRange = () => {
//       const {min, max, step} = getPriceRangeConfig(filteredResults);
//       setPriceRange({min, max, step});
//       setMinPrice(0);
//       setMaxPrice(max);
//     }
  
  
//    useEffect(() => {
//     updatePriceRange();
//    }, [])

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
      
//       <div className="flex">
//         {/* Sidebar - Hidden on mobile */}
//         <div className="hidden lg:block">
//           <Sidebar priceRange={priceRange} />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1">
//           <div className="max-w-7xl mx-auto p-3 lg:p-8">
//             {/* Back Button and Search Info */}
//             <div className="mb-8">
//               <button
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2 text-[#FF6B7A] hover:text-[#FF5566] font-semibold mb-4 transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 Back
//               </button>
              
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
//                 <p className="text-gray-600">
//                   {query ? (
//                     <>
//                       Found <span className="font-semibold">{filteredResults.length}</span> result{filteredResults.length !== 1 ? 's' : ''} for "<span className="font-semibold">{query}</span>"
//                     </>
//                   ) : (
//                     'Enter a search term to find vehicles'
//                   )}
//                 </p>
//               </div>
//             </div>

//             {/* Filter Button for Mobile */}
//             <div className="mb-6 lg:hidden">
//               <button 
//                 // onClick={() => setIsFilterOpen(true)}
//                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
//               >
//                 <SlidersHorizontal className="w-5 h-5" />
//                 Filters
//               </button>
//             </div>

//             {/* Results Grid */}
//             {filteredResults.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
//                 {filteredResults.map(vehicleList => (
//                   <CarCard vehicleData={vehicleList} />
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-16 px-4">
//                 <div className="text-center">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
//                   <p className="text-gray-600 mb-6">
//                     {query ? (
//                       <>We couldn&apos;t find any vehicles matching "<span className="font-semibold">{query}</span>". Try a different search term or browse all listings.</>
//                     ) : (
//                       'Try searching for vehicles by name, location, or type.'
//                     )}
//                   </p>
//                   <button
//                     onClick={() => router.push('/main')}
//                     className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                   >
//                     Browse All Vehicles
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Mobile Filter Bottom Sheet */}
//       {
//       // isFilterOpen && (
//       false && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             // onClick={() => setIsFilterOpen(false)}
//           />
//           <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 lg:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
//             <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
//               <h2 className="text-lg font-bold text-gray-900">Filters</h2>
//               <button
//                 // onClick={() => setIsFilterOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="p-6">
//               <Sidebar isMobile={true} priceRange={priceRange} />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// =====================================================================


'use client'

import { useEffect, useState, useMemo }   from 'react'
import { useParams, useRouter }           from 'next/navigation'
import { Header }                         from '@/components/header'
import { Sidebar }                        from '@/components/sidebar'
import { CarCard }                        from '@/components/car-card'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { GlobalState, useAppStore }       from '@/store/app-store'
import { getPriceRangeConfig }            from '@/utils/getPriceRangeConfig'
import { applyVehicleFilters }            from '@/utils/applyVehicleFilters'

export default function SearchPage() {
  const params  = useParams()
  const query   = params.search || ''
  const router  = useRouter()

  const vehicleList    = useAppStore((state: GlobalState) => state.vehicles)
  const appliedFilters = useAppStore((state) => state.appliedFilter)
  const isFilterActive = useAppStore((state) => state.isFilterActive)
  const setMaxPrice    = useAppStore((state) => state.setMaxPrice)
  const setMinPrice    = useAppStore((state) => state.setMinPrice)

  const [priceRange,   setPriceRange]   = useState({ min: 0, max: 500000, step: 1000 })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Step 1 — filter by keyword search
  const keywordResults = useMemo(() => {
    if (typeof query !== 'string' || !query.trim()) return vehicleList

    const lowerQuery = query.toLowerCase()
    return vehicleList.filter((vehicle) =>
      vehicle.brand?.toLowerCase().includes(lowerQuery)        ||
      vehicle.model?.toLowerCase().includes(lowerQuery)        ||
      vehicle.title?.toLowerCase().includes(lowerQuery)        ||
      vehicle.location?.region?.toLowerCase().includes(lowerQuery) ||
      vehicle.location?.town?.toLowerCase().includes(lowerQuery)   ||
      vehicle.location?.otherTown?.toLowerCase().includes(lowerQuery)
    )
  }, [query, vehicleList])

  // Step 2 — apply sidebar filters on top of keyword results
  // Pass 'all' for tab since search page has no category tabs
  const filteredResults = useMemo(() =>
    applyVehicleFilters(keywordResults, appliedFilters, 'all', isFilterActive),
    [keywordResults, appliedFilters, isFilterActive]
  )

  const updatePriceRange = () => {
    const { min, max, step } = getPriceRangeConfig(keywordResults)
    setPriceRange({ min, max, step })
    setMinPrice(0)
    setMaxPrice(max)
  }

  useEffect(() => {
    updatePriceRange()
  }, [keywordResults])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar priceRange={priceRange} />
        </div>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-3 lg:p-8">

            {/* Back + search info */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#FF6B7A] hover:text-[#FF5566] font-semibold mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
              <p className="text-gray-600">
                {query ? (
                  <>
                    Found{' '}
                    <span className="font-semibold">{filteredResults.length}</span>
                    {' '}result{filteredResults.length !== 1 ? 's' : ''} for{' '}
                    "<span className="font-semibold">{query}</span>"
                    {isFilterActive && (
                      <span className="ml-2 text-xs text-[#FF6B7A] font-medium">
                        (filters applied)
                      </span>
                    )}
                  </>
                ) : (
                  'Enter a search term to find vehicles'
                )}
              </p>
            </div>

            {/* Filter button — mobile only */}
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {isFilterActive && (
                  <span className="w-2 h-2 rounded-full bg-[#FF6B7A]" />
                )}
              </button>
            </div>

            {/* Results grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                {filteredResults.map((vehicle) => (
                  <CarCard key={vehicle.id} vehicleData={vehicle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                <p className="text-gray-600 mb-6">
                  {isFilterActive ? (
                    <>
                      No vehicles match your search and filters.{' '}
                      <button
                        onClick={() => useAppStore.getState().resetFilter(priceRange.max)}
                        className="text-[#FF6B7A] font-semibold hover:underline"
                      >
                        Clear filters
                      </button>{' '}
                      to see more results.
                    </>
                  ) : query ? (
                    <>
                      We couldn&apos;t find any vehicles matching{' '}
                      "<span className="font-semibold">{query}</span>".
                      Try a different search term or browse all listings.
                    </>
                  ) : (
                    'Try searching for vehicles by name, location, or type.'
                  )}
                </p>
                <button
                  onClick={() => router.push('/main')}
                  className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse all vehicles
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile filter bottom sheet */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <Sidebar
                isMobile={true}
                priceRange={priceRange}
                closeFilter={() => setIsFilterOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}



