'use client'

import { timeAgo } from '@/utils/timeAgo'
import { Timestamp } from 'firebase/firestore'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { formatPrice } from '@/utils/formatPrice'
import { arrangeImageList } from '@/utils/arrangeImageList'
import { VehicleData } from '@/lib/types'
import { useAppStore } from '@/store/app-store'

export function CarCard({ vehicleData }: { vehicleData: VehicleData}) {

  const {
    id,
    title,
    price,
    location,
    condition,
    createdAt,
    imageUrls: images,
    coverImage
  } = vehicleData

  const arrangedImages = arrangeImageList(images, coverImage);

  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const onModalOpen = useAppStore((state) => state.setModalOpen);

  const imageList = arrangedImages

  const hasMultipleImages = imageList.length > 1
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleLikeClick = () => {
    if (!isAuthenticated) { 
      onModalOpen(); 
      return 
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleShowDetails = (id: string) => {
    router.push(`/vehicle/${id}`)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    if (!hasMultipleImages) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % imageList.length)
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div 
        ref={imageRef}
        className="relative h-48 bg-gray-200 overflow-hidden group cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          <Image
            key={currentImageIndex}
            src={imageList[currentImageIndex]}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-500 select-none animate-in fade-in"
          />
        </div>
        
        {/* Circle Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
            {imageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-[#FF6B7A] w-6'
                    : 'bg-[#CCCCCC] bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-white bg-white/70 px-3 py-1 rounded text-xs text-gray-600 font-medium">
          {'Posted '}{timeAgo(createdAt)}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className="absolute z-10 top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded transition-all"
        >
          <Heart
            // className={`w-4 h-4 transition-colors ${liked ? 'fill-[#FF6B7A] text-[#FF6B7A]' : 'text-gray-400'}`}
            className={`w-4 h-4 transition-colors  text-gray-400`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-3 text-sm truncate">
          {title}
        </h3>

        {/* Specs Grid */}
        <div className="grid lg:grid-cols-2 gap-1 lg:gap-2 mb-4 text-xs">
          
          <div className="flex flex-row lg:flex-col">
            <p className="text-gray-500">Condition</p>
            <p className="font-semibold text-gray-900 ml-1 lg:ml-0 truncate w-auto">{condition}</p>
          </div>

          <div className="flex flex-row lg:flex-col">
            <p className="text-gray-500">Location</p>
            <p className="font-semibold text-gray-900 ml-1 lg:ml-0 truncate">{`${location.region}, ${location.town}`}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-2 lg:my-3"></div>

        {/* Footer */}
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-0 lg:items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">{'GHS ' + formatPrice(price)}</p>
          </div>
          <button 
            onClick={() => handleShowDetails(id)}
            className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-3 py-1 rounded text-xs font-semibold transition-colors">
            More details
          </button>
        </div>
      </div>
    </div>
  )
}
