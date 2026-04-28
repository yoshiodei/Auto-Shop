'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { CarCard } from '@/components/car-card'
import { Search, X, SlidersHorizontal, Loader2, Loader, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GlobalState, useAppStore } from '@/store/app-store'
import { VehicleData } from '@/lib/types'
import { fi } from 'date-fns/locale'
import { Empty } from '@/components/ui/empty'
import EmptyListing from '@/components/empty-listing'



export default function MainPage() {
  const router = useRouter()

  const onModalOpen = useAppStore((state) => state.setModalOpen);


  const isFilterOpen = useAppStore((state) => state.isFilterOpen);
  const setIsFilterOpen = useAppStore((state) => state.setIsFilterOpen);

  const [searchQuery, setSearchQuery] = useState('');

   const [tab, setTab] = useState<string>('all')
   const [isMouseOver, setIsMouseOver] = useState(false);

  const vehicleList =  useAppStore((state: GlobalState) => state.vehicles);
  const isFiltered = useAppStore((state) => state.isFiltered);
  const filterData = useAppStore((state) => state.filter);

//   const filteredVehicles = vehicleList.filter((vehicle: GlobalState['vehicles'][0]) => {
//     let filterMatch
    
//     if (tab === 'all') filterMatch = true
//     if (tab === 'cars') filterMatch = vehicle.category === 'car'
//     if (tab === 'bikes') filterMatch = vehicle.category === 'bike'
  
//     if (true) {
//       filterMatch = filterMatch 
//       (Number(vehicle.price) >= Number(filterData.minPrice) && Number(vehicle.price) <= Number(filterData.maxPrice)) ||
//       (vehicle.location.region.toLowerCase().includes(filterData.region.toLowerCase()) || vehicle.location.town.toLowerCase().includes(filterData.town.toLowerCase())) ||
//       (filterData.condition[vehicle.condition]) ||
//       (filterData.fuelType[vehicle.fuelType]) ||
//       (filterData.transmission[vehicle.transmission])

//       return filterMatch
//     }

//     return filterMatch
//   }
// );


 const filteredVehicles = vehicleList.filter((vehicle: GlobalState['vehicles'][0]) => {
    let filterMatch
    
    if (tab === 'all') filterMatch = true
    if (tab === 'cars') filterMatch = vehicle.category === 'car'
    if (tab === 'bikes') filterMatch = vehicle.category === 'bike'
  
    if (isFiltered) {
      if(Number(vehicle.price) < Number(filterData.minPrice) || Number(vehicle.price) > Number(filterData.maxPrice)) return false 
      if(vehicle.location.region.toLowerCase().includes(filterData.region.toLowerCase()) === false && vehicle.location.town.toLowerCase().includes(filterData.town.toLowerCase()) === false) return false
      if(filterData.condition[vehicle.condition] === false) return false
      if(filterData.fuelType[vehicle.fuelType] === false) return false
      if(filterData.transmission[vehicle.transmission] === false) return false

    }
      return filterMatch
 })





  const handleMoreDetails = (carId: number) => {
    router.push(`/vehicle/${carId}`)
  }

  const handleToggleLike = (carId: number) => {
    // toggleLike(carId)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Listings */}
        <main className="flex-1 overflow-y-auto">
          {/* Mini Hero Section */}
          <div className="m-3 lg:m-6 p-8 rounded-2xl bg-gradient-to-r from-[#FF6B7A] to-[#FF8A96] flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Perfect Vehicle</h1>
              <p className="text-lg lg:text-xl">Discover thousands of quality cars and bikes at amazing prices</p>
              {/* <button 
                onClick={() => onModalOpen()} 
                className="bg-[#007bff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </button> */}
            </div>
          </div>

          <div className="p-3 lg:p-8">
            {/* Search Bar with Button and Filter */}
            <div className="mb-8 flex gap-1">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for cars, bikes, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                />
                {
                // searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                // )
                }
              </div>
              <button disabled={searchQuery.trim() === ''} onClick={() => router.push(`search/${searchQuery}`)} className="flex bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-4 py-3 rounded-lg font-semibold transition-colors items-center gap-2">
                <Search className="w-5 h-5" />
                <span className="hidden lg:inline">Search</span>
              </button>

              <button 
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden ml-5 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* Category Tabs */}
            <div className="mb-8 border-b border-gray-200">
              <div className="flex gap-8">
                
                {['all', 'cars', 'bikes'].map((activeTab:string) => (
                  <button
                    key={activeTab}
                    onClick={() => setTab(activeTab)}
                    className={`pb-3 font-semibold text-sm md:text-base transition-colors capitalize ${
                      activeTab === tab
                        ? 'text-[#FF6B7A] border-b-2 border-[#FF6B7A]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {activeTab === 'all' ? 'All' : activeTab === 'cars' ? 'Cars' : 'Bikes'}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            { (filteredVehicles?.length > 0) && (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
              {filteredVehicles.map((vehicle) => (
                <CarCard vehicleData={vehicle} />
              ))}
            </div>)}

            { (!filteredVehicles?.length || filteredVehicles?.length <= 0) && (<EmptyListing />)}

          </div>
        </main>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {
      isFilterOpen && 
      (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-60 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 lg:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Filter Content */}
            <div className="p-6 space-y-6">
              <Sidebar isMobile={true} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
