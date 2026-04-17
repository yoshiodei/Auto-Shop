import React from 'react'
import CarAnimation from './car-animation'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-100 w-full h-screen flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <CarAnimation />
      </div>
    </div>
  )
}
