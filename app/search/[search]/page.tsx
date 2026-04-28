'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { CarCard } from '@/components/car-card'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { GlobalState, useAppStore } from '@/store/app-store'
import { useState, useMemo } from 'react'

const ALL_VEHICLES = [
  {
    id: 1,
    dayOfWeek: 'Yesterday',
    time: '13:45',
    title: 'Ford explorer (2018)',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop'
    ],
    mileage: '49 000 км',
    location: 'Dnipro',
    engine: '3.5 diesel',
    transmission: 'Machine',
    price: '₵ 17 900',
    fuel: 'Diesel',
    condition: 'Pre-owned'
  },
  {
    id: 2,
    dayOfWeek: 'Monday',
    time: '12:43',
    title: 'Honda CR-V (2019)',
    image: 'https://images.unsplash.com/photo-1606611013016-969a19f4a51a?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606611013016-969a19f4a51a?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop'
    ],
    mileage: '22 000 км',
    location: 'Dnipro',
    engine: '2.9 benzine',
    transmission: 'Machine',
    price: '₵ 23 500',
    fuel: 'Petrol',
    condition: 'Pre-owned'
  },
  {
    id: 3,
    dayOfWeek: 'Monday',
    time: '11:43',
    title: 'Audi TT (2014)',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581542831556-e355900b4b04?w=500&h=400&fit=crop'
    ],
    mileage: '49 000 км',
    location: 'Dnipro',
    engine: '2.4 benzine',
    transmission: 'Machine',
    price: '₵ 79 300',
    fuel: 'Petrol',
    condition: 'Pre-owned'
  },
  {
    id: 4,
    dayOfWeek: 'Monday',
    time: '13:13',
    title: 'Ford Ranger (2021)',
    image: 'https://images.unsplash.com/photo-1581542831556-e355900b4b04?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581542831556-e355900b4b04?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1617469767537-b85faf00c4b7?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop'
    ],
    mileage: '9 000 км',
    location: 'Dnipro',
    engine: '4.0 diesel',
    transmission: 'Machine',
    price: '₵ 44 900',
    fuel: 'Diesel',
    condition: 'Pre-owned'
  },
  {
    id: 5,
    dayOfWeek: 'Monday',
    time: '16:48',
    title: 'Mustang GT (2016)',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop'
    ],
    mileage: '22 000 км',
    location: 'Dnipro',
    engine: '6.0 benzine',
    transmission: 'Machine',
    price: '₵ 16 200',
    fuel: 'Petrol',
    condition: 'Pre-owned'
  },
  {
    id: 6,
    dayOfWeek: 'Monday',
    time: '7:13',
    title: 'BMW X7 (2019)',
    image: 'https://images.unsplash.com/photo-1617469767537-b85faf00c4b7?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617469767537-b85faf00c4b7?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581542831556-e355900b4b04?w=500&h=400&fit=crop'
    ],
    mileage: '49 000 км',
    location: 'Dnipro',
    engine: '3.5 diesel',
    transmission: 'Machine',
    price: '₵ 69 900',
    fuel: 'Diesel',
    condition: 'Pre-owned'
  },
  {
    id: 7,
    dayOfWeek: 'Yesterday',
    time: '09:30',
    title: 'Tesla Model 3 (2022)',
    image: 'https://images.unsplash.com/photo-1560958089-b8a63c111453?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a63c111453?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&h=400&fit=crop'
    ],
    mileage: '15 000 км',
    location: 'Kyiv',
    engine: 'Electric',
    transmission: 'Automatic',
    price: '₵ 45 000',
    fuel: 'Electric',
    condition: 'Pre-owned'
  },
  {
    id: 8,
    dayOfWeek: 'Monday',
    time: '14:20',
    title: 'Mercedes C-Class (2020)',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1617469767537-b85faf00c4b7?w=500&h=400&fit=crop'
    ],
    mileage: '35 000 км',
    location: 'Lviv',
    engine: '2.0 benzine',
    transmission: 'Machine',
    price: '₵ 42 500',
    fuel: 'Petrol',
    condition: 'Pre-owned'
  },
  {
    id: 9,
    dayOfWeek: 'Sunday',
    time: '10:15',
    title: 'Toyota Camry (2021)',
    image: 'https://images.unsplash.com/photo-1533473359331-35ef7dcfb4d3?w=500&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533473359331-35ef7dcfb4d3?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581542831556-e355900b4b04?w=500&h=400&fit=crop'
    ],
    mileage: '28 000 км',
    location: 'Kharkiv',
    engine: '2.5 benzine',
    transmission: 'Machine',
    price: '₵ 32 800',
    fuel: 'Petrol',
    condition: 'Pre-owned'
  }
]

export default function SearchPage() {
  const params = useParams()
  const query = params.search || ''
  const router = useRouter()
  

  const vehicleList = useAppStore((state: GlobalState) => state.vehicles)

    const likedCars = 0
    const toggleLike = false

  const filteredResults = useMemo(() => {
    if (typeof query !== 'string') return vehicleList
    if (!query.trim()) return vehicleList

    const lowerQuery = query.toLowerCase()
    return vehicleList.filter(vehicle =>
      vehicle.title.toLowerCase().includes(lowerQuery) ||
      vehicle.location.region.toLowerCase().includes(lowerQuery) ||
      vehicle.location.town.toLowerCase().includes(lowerQuery) ||
      vehicle.location?.otherTown?.toLowerCase().includes(lowerQuery)
    )
  }, [query])

  console.log('filtered query:!', filteredResults);
  

  const handleMoreDetails = (carId: number) => {
    router.push(`/vehicle/${carId}`)
  }

  const handleToggleLike = (carId: number) => {
    // toggleLike(carId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Back Button and Search Info */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#FF6B7A] hover:text-[#FF5566] font-semibold mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
                <p className="text-gray-600">
                  {query ? (
                    <>
                      Found <span className="font-semibold">{filteredResults.length}</span> result{filteredResults.length !== 1 ? 's' : ''} for "<span className="font-semibold">{query}</span>"
                    </>
                  ) : (
                    'Enter a search term to find vehicles'
                  )}
                </p>
              </div>
            </div>

            {/* Filter Button for Mobile */}
            <div className="mb-6 lg:hidden">
              <button 
                // onClick={() => setIsFilterOpen(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Results Grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                {filteredResults.map(vehicleList => (
                  <CarCard vehicleData={vehicleList} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                  <p className="text-gray-600 mb-6">
                    {query ? (
                      <>We couldn&apos;t find any vehicles matching "<span className="font-semibold">{query}</span>". Try a different search term or browse all listings.</>
                    ) : (
                      'Try searching for vehicles by name, location, or type.'
                    )}
                  </p>
                  <button
                    onClick={() => router.push('/main')}
                    className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Browse All Vehicles
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {
      // isFilterOpen && (
      false && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            // onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 lg:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                // onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <Sidebar isMobile={true} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
