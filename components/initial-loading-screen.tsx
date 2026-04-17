'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { Car } from 'lucide-react'
import CarAnimation from './car-animation'
import { fetchListings } from '@/utils/fetchListings'
import { useAppStore, GlobalState } from '@/store/app-store'


export default function InitialLoadingScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  const setListings = useAppStore((state: GlobalState) => state.setListings)

  const getListingsData = async () => {
      const listings = await fetchListings()
      setListings(listings)
      router.push('/main')
      setIsLoading(false)
  }

  useEffect(() => {
    
    getListingsData()
    
    
  }, [router])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-100 w-full h-screen flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <CarAnimation />
      </div>
    </div>
  )
}
