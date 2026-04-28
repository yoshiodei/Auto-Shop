'use client';

import { Header } from '@/components/header'
import { useEffect, useState } from 'react';
import { Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/store/app-store';
// import { useWishlistStore } from '@/store/wishlistStore';
// import VehicleCard from '@/components/VehicleCard';
import type { VehicleData } from '@/lib/types';
import { timeAgo } from '@/utils/timeAgo';
import { formatPrice } from '@/utils/formatPrice';

const WishlistPage = () => {
  const user                           = useAppStore((state) => state.user);
  const wishlistedIds = useAppStore((state) => state.wishlistedIds);
  const loadWishlist = useAppStore((state) => state.loadWishlist);

  const [vehicles,  setVehicles]  = useState<VehicleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist IDs into Zustand if not already loaded
  useEffect(() => {
    if (user) loadWishlist(user.uid);
  }, [user]);

  // Fetch full vehicle docs for each wishlisted ID
  useEffect(() => {
    const fetchWishlistedVehicles = async () => {
      setIsLoading(true);

      if (!wishlistedIds.length) {
        setVehicles([]);
        setIsLoading(false);
        return;
      }

      try {
        const snapshots = await Promise.all(
          wishlistedIds.map((id) => getDoc(doc(db, 'listings', id)))
        );

        const results = snapshots
          .filter((snap) => snap.exists())           // ignore deleted vehicles
          .map((snap) => ({ id: snap.id, ...snap.data() } as VehicleData));

        setVehicles(results);
      } catch (error: any) {
        console.error('Failed to fetch wishlist vehicles:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistedVehicles();
  }, [wishlistedIds]);

  // ── Loading state ────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Not logged in ────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <p className="text-gray-900 font-medium text-lg">Sign in to view your wishlist</p>
        <p className="text-gray-500 text-sm mt-2">
          You need to be logged in to save and view your favourite vehicles.
        </p>
      </div>
    );
  }

  // ── Empty wishlist ────────────────────────────────
  if (!vehicles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <p className="text-gray-900 font-medium text-lg">No saved vehicles yet</p>
        <p className="text-gray-500 text-sm mt-2 max-w-xs">
          Tap the heart icon on any vehicle to save it here for later.
        </p>
      </div>
    );
  }

  // ── Wishlist grid ────────────────────────────────
  return (
    <div className="">
      <Header />
    <div className="p-6">

      {/* <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Saved vehicles</h1>
        <span className="text-sm text-gray-500">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</span>
      </div> */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-[#FF6B7A] fill-[#FF6B7A]" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>
        <p className="text-gray-600">{vehicles.length} vehicles saved</p>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div> */}
      {/* Wishlist Grid */}
      {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(item => (
                <Link key={item.id} href={`/vehicle/${item.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        // onClick={(e) => {
                        //   e.preventDefault()
                        //   removeFromWishlist(item.id)
                        // }}
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
                          {`${item.location.region}, ${item.location.otherTown ? item.location.otherTown : item.location.town}`}
                        </div>
                        {/* <p className="text-gray-600">{item.mileage}</p> */}
                      </div>

                      <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                        <p className="text-lg font-bold text-[#FF6B7A]">{"₵ " + formatPrice(item.price)}</p>
                        {/* <p className="text-xs text-gray-500">Saved</p> */}
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
  );
};

export default WishlistPage;

