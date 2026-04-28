'use client'

import { Menu, Bell, Heart, MessageCircle, User, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const user = useAppStore((state) => state.user);
  const onModalOpen = useAppStore((state) => state.setModalOpen);
  const setIsFilterOpen = useAppStore((state) => state.setIsFilterOpen);

  // const handleButtonClick = (action: () => void) => {
  //   if (!isAuthenticated) {
  //     onModalOpen();
  //     return;
  //   }
  // }

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsFilterOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/main">
          <button className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#FF6B7A] rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-bold text-gray-900">AUTO WORLD</span>
          </button>
        </Link>

        {/* Desktop Icons */}
        {user && (<div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <Link href="/notifications">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <Link href="/wishlist">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <Link href="/chat">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Messages">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <Link href={`/profile/${user?.uid}`}>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Profile">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
        </div>)}

        {!user && (<div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <Link href="/auth/signin">
            <button className="flex items-center gap-3 w-full rounded-lg transition-colors text-gray-700 py-2 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-bold">
              <User className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-700">Sign In</span>
            </button>
          </Link>
        </div>)}

        {/* Mobile Menu Button */}
        <button
          onClick={() => handleOpenMenu()}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Mobile Side Navigation */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-60 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Side Panel */}
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-40 md:hidden shadow-lg animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <span className="font-bold text-lg text-gray-900">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Navigation Items */}
            {user && (<div className="p-6 space-y-4">
              <Link href="/notifications" onClick={() => setIsMenuOpen(false)}>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <Bell className="w-5 h-5 text-[#FF6B7A]" />
                  <span className="font-medium">Notifications</span>
                </button>
              </Link>
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <Heart className="w-5 h-5 text-[#FF6B7A]" />
                  <span className="font-medium">Wishlist</span>
                </button>
              </Link>
              <Link href="/chat" onClick={() => setIsMenuOpen(false)}>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <MessageCircle className="w-5 h-5 text-[#FF6B7A]" />
                  <span className="font-medium">Messages</span>
                </button>
              </Link>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                  <User className="w-5 h-5 text-[#FF6B7A]" />
                  <span className="font-medium">Profile</span>
                </button>
              </Link>
            </div>)}

            {!user && (<div className="p-6 space-y-4">
              <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="flex items-center gap-3 w-full rounded-lg transition-colors text-gray-700 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-bold">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-700">Sign Up</span>
                </button>
              </Link>
            </div>)}
          </div>
        </>
      )}
    </header>
  )
}
