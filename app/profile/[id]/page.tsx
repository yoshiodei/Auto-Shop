'use client'

import { Header } from '@/components/header'
import { User, Mail, Phone, MapPin, Edit2, Settings, LogOut, Star, Award, Plus, BarChart3, TrendingUp, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { formatMemberSince } from '@/utils/formatJoinedSince'
import { LogoutModal } from '@/components/logout-modal'
import { getInitials } from '@/utils/getInitials';
import UserAvatar from '@/components/use-avatar'
import { UserData } from '@/lib/types'
import { fetchUser } from '@/utils/auth/fetchUser'
import LoadingScreen from '@/components/loading-screen'

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id

  const [loading, setLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const onLogoutModalClose = () => setIsLogoutModalOpen(false);

  const user =  useAppStore((state) => state.user)

  const [userData, setUserData] = useState<UserData | null>(null)

  const fetchUserData = async () => {
    setLoading(true);
    if(typeof userId === 'string') {
      if(user?.uid === userId) {
        setUserData(user);
      } else {
        const userData = await fetchUser(userId);
        setUserData(userData);
      }
    } else {
        setUserData(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUserData();
  }, [userData, router]);


 if (loading) {
    return(
      <LoadingScreen />
    )
 }

 if (!userData && !loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">User not found</p>
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-start gap-4">
                {/* <div className="w-24 h-24 bg-[#FF6B7A] rounded-full flex items-center justify-center">
                  {!initials && (<User className="w-12 h-12 text-white" />)}
                  {initials && (<span className="text-2xl font-bold text-white">{initials}</span>)}
                </div> */}
                <UserAvatar fullName={userData?.fullName || ''} size="lg" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{userData?.fullName}</h1>
                  <p className="text-gray-600 mt-1">{formatMemberSince(userData?.createdAt)}</p>
                  
                </div>
              </div>
              {(userData?.role === 'admin') && (<div className="flex gap-2 mt-4">
                {/* <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 bg-[#FF6B7A] hover:bg-[#FF5566] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button> */}
                <button
                  onClick={() => router.push('/post-vehicle')}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Post Vehicle
                </button>
              </div>)}
            </div>
          </div>

          {/* Stats */}
          { userData?.role === 'admin' && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-[#FF6B7A]">{'50'}</p>
                <p className="text-gray-600 text-sm mt-2">Active Listings</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-[#FF6B7A]">{'50'}</p>
              <p className="text-gray-600 text-sm mt-2">Vehicles Sold</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-bold text-[#FF6B7A]">43</p>
              </div>
              <p className="text-gray-600 text-sm mt-2">Total Users</p>
            </div>
          </div>)}

          {/* Dashboard */}
          { userData?.role === 'admin' && (
            <div className="bg-white rounded-lg p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{51}</p>
                  </div>
                  <Eye className="w-10 h-10 text-blue-500 opacity-20" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900">{11}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{50}</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-purple-500 opacity-20" />
                </div>
              </div>
            </div>
          </div>)}

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#FF6B7A]" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{userData?.email}</p>
                </div>
              </div>
              {userData?.phone && (
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <Phone className="w-5 h-5 text-[#FF6B7A]" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{userData?.phone}</p>
                  </div>
              </div>
              )}
              {userData?.location && (
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <MapPin className="w-5 h-5 text-[#FF6B7A]" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{userData?.location}</p>
                  </div>
                </div>
              )}
              </div>
              </div>
            {/* </div>
          </div> */}

          {/* About */}
          {/* <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700">{userData.bio}</p>
          </div> */}

          {/* Settings and Account */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-3">
              {/* <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Settings & Privacy</span>
              </button> */}
              {/* <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Email Preferences</span>
              </button> */}
              <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-left">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal isModalOpen={isLogoutModalOpen} onModalClose={onLogoutModalClose} />
    </div>
  )
}
