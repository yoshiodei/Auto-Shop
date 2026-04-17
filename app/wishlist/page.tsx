'use client'

import { Header } from '@/components/header'
import { Heart, MapPin, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'

interface WishlistItem {
  id: number
  title: string
  price: string
  image: string
  location: string
  mileage: string
  savedDate: string
}

const SAMPLE_WISHLIST: WishlistItem[] = [
  {
    id: 1,
    title: 'Ford Explorer (2018)',
    price: '₵ 17 900',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400&h=300&fit=crop',
    location: 'Accra, Ghana',
    mileage: '49,000 km',
    savedDate: 'Jan 15, 2025'
  },
  {
    id: 2,
    title: 'Honda CR-V (2019)',
    price: '₵ 23 500',
    image: 'https://images.unsplash.com/photo-1606611013016-969a19f4a51a?w=400&h=300&fit=crop',
    location: 'Kumasi, Ghana',
    mileage: '22,000 km',
    savedDate: 'Jan 20, 2025'
  },
  {
    id: 3,
    title: 'BMW X7 (2019)',
    price: '₵ 69 900',
    image: 'https://images.unsplash.com/photo-1617469767537-b85faf00c4b7?w=400&h=300&fit=crop',
    location: 'Accra, Ghana',
    mileage: '49,000 km',
    savedDate: 'Jan 22, 2025'
  },
  {
    id: 4,
    title: 'Audi TT (2014)',
    price: '₵ 79 300',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=400&h=300&fit=crop',
    location: 'Takoradi, Ghana',
    mileage: '49,000 km',
    savedDate: 'Jan 24, 2025'
  }
]

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(SAMPLE_WISHLIST)

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-3 lg:p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-[#FF6B7A] fill-[#FF6B7A]" />
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-gray-600">{wishlist.length} vehicles saved</p>
          </div>

          {/* Wishlist Grid */}
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map(item => (
                <Link key={item.id} href={`/vehicle/${item.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromWishlist(item.id)
                        }}
                        className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded transition-all"
                      >
                        <Heart className="w-5 h-5 fill-[#FF6B7A] text-[#FF6B7A]" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF6B7A] transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </div>
                        <p className="text-gray-600">{item.mileage}</p>
                      </div>

                      <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                        <p className="text-lg font-bold text-[#FF6B7A]">{item.price}</p>
                        <p className="text-xs text-gray-500">Saved {item.savedDate}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Your wishlist is empty</p>
              <p className="text-gray-500 mt-2">Start adding vehicles to save them for later</p>
              <Link href="/main">
                <button className="mt-6 bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Browse Vehicles
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
