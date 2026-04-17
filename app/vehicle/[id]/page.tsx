'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchVehicle } from '@/utils/fetchVehicle'
import { Header } from '@/components/header'
import { ArrowLeft, ChevronLeft, ChevronRight, Share2, Heart, Fuel, Cog, MessageCircle, MapPin, Eye } from 'lucide-react'
import Image from 'next/image'
import { VehicleData } from '@/lib/types'
import { arrangeImageList } from '@/utils/arrangeImageList'
import { formatPrice } from '@/utils/formatPrice'
import LoadingScreen from '@/components/loading-screen'
import { useAppStore } from '@/store/app-store'

export default function VehicleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id

  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true)

  const isAuthenticated =  useAppStore((state) => state.isAuthenticated);
  const onModalOpen = useAppStore((state) => state.setModalOpen);

  const fetchVehicleData = async () => {
    setLoading(true)
    if(typeof vehicleId === 'string') {
      const vehicleData = await fetchVehicle(vehicleId)
      await setVehicle(vehicleData)
      setLoading(false)
    }
  }

  const handleMessageClick = () => {
    if(!isAuthenticated) {
      onModalOpen();
      return;
    }
  }

  useEffect(() => {
    fetchVehicleData();
  }, [vehicleId])


  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const imageList = arrangeImageList(vehicle?.imageUrls || [], vehicle?.coverImage || '')

  if(loading){
    <LoadingScreen />
  }

  if (!vehicle && !loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Vehicle not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-[#FF6B7A] hover:text-[#FF5566] font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto">
        {/* Back Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-8">
            {/* Main Image Carousel */}
            <div className="relative rounded-lg overflow-hidden bg-gray-200 h-96">
              <Image
                src={imageList[currentImageIndex]}
                alt={`${vehicle?.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white opacity-20 hover:opacity-100 p-2 rounded-full transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white opacity-20 hover:bg-opacity-100 p-2 rounded-full transition-all z-10"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black opacity-30 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {imageList.length}
              </div>
              {/* Share and Like Buttons */}
              {/* <div className="absolute top-4 right-4 flex gap-2">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full transition-all">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full transition-all"
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-[#FF6B7A] text-[#FF6B7A]' : 'text-gray-700'}`} />
                </button>
              </div> */}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageList.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    index === currentImageIndex ? 'ring-2 ring-[#FF6B7A]' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

              {/* Vehicle Info */}
              <div className="bg-white rounded-lg p-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 min-[800px]:hidden mb-4 capitalize">{vehicle?.title}</h1>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      {vehicle?.location.town}, {vehicle?.location.town === 'other' ? vehicle.location.otherTown : vehicle?.location.region}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <Eye className="w-5 h-5 text-[#FF6B7A]" />
                      <span className="text-sm font-semibold">{vehicle?.views?.length || 0} views</span>
                    </div>
                  </div>
                </div>

                {vehicle?.category === 'car' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">Mileage</p>
                      <p className="text-lg font-bold text-gray-900">{vehicle?.mileage || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Year</p>
                    <p className="text-lg font-bold text-gray-900">{vehicle?.year || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-[#FF6B7A]" />
                    <div>
                      <p className="text-gray-500 text-sm">Fuel</p>
                      <p className="font-bold text-gray-900 capitalize">{vehicle?.fuelType || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
                    <Cog className="w-5 h-5 text-[#FF6B7A]" />
                    <div>
                      <p className="text-gray-500 text-sm">Transmission</p>
                      <p className="font-bold text-gray-900 capitalize">{vehicle?.transmission || 'N/A'}</p>
                    </div>
                  </div>
                </div>)}

                {vehicle?.category === 'car' && (<hr />)}

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{`${vehicle?.category === 'bike' ? 'Bike' : 'More Car'} Details`}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(vehicle?.category === 'bike' && vehicle?.brand) && (
                      <div>
                        <p className="text-gray-500 text-sm">Brand</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.brand}</p>
                      </div>
                    )}
                    {vehicle?.condition && (
                      <div>
                        <p className="text-gray-500 text-sm">Condition</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.condition}</p>
                      </div>
                    )}
                    {vehicle?.VIN && (
                      <div>
                        <p className="text-gray-500 text-sm">VIN</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.VIN}</p>
                      </div>
                    )}
                    {vehicle?.bodyType && (
                      <div>
                        <p className="text-gray-500 text-sm">Body Type</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.bodyType}</p>
                      </div>
                    )}
                    {vehicle?.gearCount && (
                      <div>
                        <p className="text-gray-500 text-sm">Gear Count</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.gearCount}</p>
                      </div>
                    )}
                    {vehicle?.frameMaterial && (
                      <div>
                        <p className="text-gray-500 text-sm">Frame Material</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.frameMaterial}</p>
                      </div>
                    )}
                    {vehicle?.bikeType && (
                      <div>
                        <p className="text-gray-500 text-sm">Bike Type</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.bikeType}</p>
                      </div>
                    )}
                    {vehicle?.brakeType && (
                      <div>
                        <p className="text-gray-500 text-sm">Brake Type</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.brakeType}</p>
                      </div>
                    )}
                    {vehicle?.colour && (
                      <div>
                        <p className="text-gray-500 text-sm">Colour</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.colour}</p>
                      </div>
                    )}
                    {vehicle?.engine && (
                      <div>
                        <p className="text-gray-500 text-sm">Engine Size</p>
                        <p className="font-bold text-gray-900 capitalize">{vehicle?.engine}</p>
                      </div>
                    )}
                  </div>
                </div>

                {vehicle?.description && (<hr/> )}

                {vehicle?.description && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{vehicle?.description || 'N/A'}</p>
                  </div>
                )}

                {(vehicle?.features && vehicle?.features?.length > 0) && (<hr/> )}

                {vehicle?.features && vehicle?.features?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {vehicle?.features?.map(feature => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#FF6B7A] rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>)}
              </div>
            </div>

            {/* Right Column - Seller Info and Actions */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h1 className="text-2xl font-bold text-gray-900 max-[800px]:hidden mb-4 capitalize">{vehicle?.title}</h1>
                <p className="text-gray-500 text-sm mb-2">Price</p>
                <p className="text-4xl font-bold text-[#FF6B7A]">{"₵ " + formatPrice(Number(vehicle?.price))}</p>

                {/* <div className="space-y-3">
                  <button className="w-full bg-[#FF6B7A] hover:bg-[#FF5566] text-white py-3 rounded-lg font-semibold transition-colors">
                    Contact Seller
                  </button>
                </div> */}
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-semibold text-gray-900">Seller Name Goes Here</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Contact</p>
                    <p className="font-semibold text-gray-900">Seller Phone Number Goes Here</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <button
                      onClick={handleMessageClick} 
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Section */}
        <div className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* {SIMILAR_VEHICLES.map(car => (
                <button
                  key={car.id}
                  onClick={() => router.push(`/vehicle/${car.id}`)}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-[#FF6B7A] hover:shadow-lg transition-all"
                >
                  <div className="relative w-full h-40 bg-gray-200">
                    <Image
                      src={car.image}
                      alt={car.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">{car.title}</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {car.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        {car.mileage}
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        {car.fuel}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-lg font-bold text-[#FF6B7A]">{car.price}</p>
                    </div>
                  </div>
                </button>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
