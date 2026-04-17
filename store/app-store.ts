// import { Timestamp } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GlobalState {
  isFiltered: boolean
  setIsFiltered: (filtered: boolean) => void

  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void

  filter: {
    minPrice: number;
    maxPrice: number;
    region: string;  
    town: string;
    condition: {new: boolean; 'slightly used': boolean; used: boolean};
    transmission: { manual: boolean; automatic: boolean };
    fuelType: { petrol: boolean; diesel: boolean; electric: boolean; hybrid: boolean };
  },

  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;

  setLocation: (region: string, town: string) => void;
  setCondition: (condition: 'new' | 'slightly used' | 'used') => void;
  setTransmission: (transmission: 'manual' | 'automatic') => void;
  setFuelType: (fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid') => void;

  resetFilter: () => void;


  vehicles: {
    id: string
    title: string
    year?: string
    brand?: string
    model?: string
    condition: 'new' | 'slightly used' | 'used'
    mileage: string
    price: string
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    transmission: 'manual' | 'automatic'
    engine: string
    location: {
      region: string
      town: string
      otherTown?: string
    }
    description: string
    gearCount: string
    VIN: string
    colour: string
    frameMaterial: string
    brakeType: string
    bikeType: string
    bodyType: string
    features: []
    status?: 'available' | 'sold'
    images: string[]
    imagesURL: string[]
    coverImage: string
    createdAt: any
    category: 'bike' | 'car'
  }[]

  setListings: (listings: GlobalState['vehicles']) => void;


  isModalOpen: boolean
  
  setModalOpen: () => void
  setModalClose: () => void

  user:{
    uid: string
    fullName: string
    email: string
    phone?: string | null
    location?: string | null
    createdAt: any
    role?: '' | 'user' | 'admin' | string
    provider?: string
  } | null

  setUser: (user: GlobalState['user']) => void

  clearUser: () => void

  isAuthenticated: boolean
}

export const useAppStore = create<GlobalState>()(
  persist(
  (set, get) => ({

  isFiltered: false,
  setIsFiltered: (filtered: boolean) => set({ isFiltered: filtered }),

  filter: {
    minPrice: 0,
    maxPrice: 500000,
    region: '',
    town: '',
    condition: {new: false, 'slightly used': false, used: false},
    transmission: { manual: false, automatic: false },
    fuelType: { petrol: false, diesel: false, electric: false, hybrid: false },
  },

  setMinPrice: (price: number) => set({ filter: { ...get().filter, minPrice: price } }),
  setMaxPrice: (price: number) => set({ filter: { ...get().filter, maxPrice: price } }),
  setLocation: (region: string, town: string) => set({ filter: { ...get().filter, region, town } }),

  setCondition: (condition: 'new' | 'slightly used' | 'used') => {
    const current = get().filter.condition[condition];
    set({ filter: { ...get().filter, condition: { ...get().filter.condition, [condition]: !current } } });
  },

  setTransmission: (transmission: 'manual' | 'automatic') => {
    const current = get().filter.transmission[transmission];
    set({ filter: { ...get().filter, transmission: { ...get().filter.transmission, [transmission]: !current } } });
  },

  setFuelType: (fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid') => {
    const current = get().filter.fuelType[fuelType];
    set({ filter: { ...get().filter, fuelType: { ...get().filter.fuelType, [fuelType]: !current } } });
  },

  resetFilter: () => set({ filter: {
    minPrice: 0,
    maxPrice: 500000,
    region: '',
    town: '',
    condition: {new: false, 'slightly used': false, used: false},
    transmission: { manual: false, automatic: false },
    fuelType: { petrol: false, diesel: false, electric: false, hybrid: false },
  }}
),

isFilterOpen: false,

setIsFilterOpen: (open: boolean) => set({ isFilterOpen: open }),

  vehicles:[],

  setListings: (listings: GlobalState['vehicles']) => set({ vehicles: listings }),

  isModalOpen: false,

  setModalOpen: () => set({ isModalOpen: true }),
  setModalClose: () => set({ isModalOpen: false }),

  user: null,

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  isAuthenticated: false,

}),
{
  name: 'auto-world-store',

  partialize: (state) => ({
    filter: state.filter,
    user: state.user,
  })
}
));










// 'use client'

// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   doc,
//   getDoc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   Timestamp
// } from "firebase/firestore"
// import { db } from "@/lib/firebase"

// interface FilterState {
//   minVal: number
//   maxVal: number
//   region: string
//   town: string
//   condition: {new: boolean; 'slightly used': boolean; used: boolean}
//   transmission: { manual: boolean; automatic: boolean}
//   fuelType: { petrol: boolean; diesel: boolean; electric: boolean; hybrid: boolean }
// }

// interface UserState {
//   uid?: string
//   name: string
//   email: string
//   phone: string
//   location: string
//   bio: string
//   joined: string
//   listings: number
//   rating: number
//   reviews: number
//   sold: number
//   totalViews: number
//   avgResponseTime: string
//   totalRevenue: string
//   avatar?: string
// }

// interface AuthState {
//   isAuthenticated: boolean
//   user: UserState | null
//   loading: boolean
//   error: string | null
//   setAuth: (user: UserState) => void
//   clearAuth: () => void
//   setLoading: (loading: boolean) => void
//   setError: (error: string | null) => void
// }

// interface Listing {
//   id?: string 
//   description: string 
//   title: string //done
//   price: string | number
//   condition: 'new' | 'slightly used' | 'used' //done
//   images: string[]
//   location: { town: string; region: string }
//   category: 'car' | 'bike'

//   attributes: {
//     car: {
//       colour?: string //done
//       brand: string //done
//       model: string //done
//       year: string | number //done
//       mileage: string | number //done
//       transmission: "manual" | "automatic" //done
//       fuelType: "petrol" | "diesel" | "electric" | "hybrid" //done
//       engineSize?: string | number //done
//       VIN?: string //done
//       bodyType?: "sedan" | "suv" | "hatchback" | "coupe" | "convertible" | "wagon" | "van" | "pickup"
//       features?: string[]
//     },
//     bike: {
//       brand?: string //done
//       colour?: string //done
//       year?: string | number //done
//       mileage?: string | number //done
//       transmission?: "manual" | "automatic" //done
//       fuelType?: "petrol" | "diesel" | "electric" | "hybrid" //done
//       gearCount?: string | number //done
//       brakeType?: "disc" | "rim" //done
//       frameMaterial?: "steel" | "aluminum" | "carbon" //done
//       bikeType?: "mountain" | "road" | "hybrid" | "electric" //done
//       features?: string[]
//     }

//     createdAt: Timestamp
//     updatedAt: Timestamp
//   }
  
//   views: string[]
// }

// interface AppStore extends AuthState {

//   listings: Listing[]
//   filteredListings: Listing[]
//   selectedListing: Listing | null

//   fetchListings: () => Promise<void>
//   getListingById: (id: string) => Promise<void>

//   createListing: (data: Partial<Listing>) => Promise<{ success: boolean; error?: string }>
//   updateListing: (id: string, data: Partial<Listing>) => Promise<{ success: boolean; error?: string }>
//   deleteListing: (id: string) => Promise<{ success: boolean; error?: string }>

//   applyFilters: () => void

//   // Liked cars state
//   likedCars: number[]
//   toggleLike: (carId: number) => void
  
//   // Search state
//   searchQuery: string
//   setSearchQuery: (query: string) => void
  
//   // Tab state
//   activeTab: 'all' | 'cars' | 'bikes'
//   setActiveTab: (tab: 'all' | 'cars' | 'bikes') => void
  
//   // Filter state
//   filters: FilterState
//   setFilters: (filters: Partial<FilterState>) => void
//   resetFilters: () => void
  
//   // Mobile UI state
//   isFilterOpen: boolean
//   setIsFilterOpen: (open: boolean) => void
  
//   isMenuOpen: boolean
//   setIsMenuOpen: (open: boolean) => void
  
//   // User state
//   userData: UserState
//   setUser: (user: Partial<UserState>) => void
// }

// const defaultFilters: FilterState = {
//   minVal: 0,
//   maxVal: 500000,
//   region: '',
//   town: '',
//   condition: { new: false, 'slightly used': false, used: false },
//   transmission: { manual: false, automatic: false },
//   fuelType: { petrol: false, diesel: false, electric: false, hybrid: false }
// }

// const defaultUser: UserState = {
//   name: 'Kwame Osei',
//   email: 'kwame.osei@email.com',
//   phone: '+233 244 567 890',
//   location: 'Accra, Ghana',
//   bio: 'Passionate about quality vehicles and fair deals',
//   joined: 'January 2023',
//   listings: 12,
//   rating: 4.8,
//   reviews: 45,
//   sold: 34,
//   totalViews: 1892,
//   avgResponseTime: '2 hours',
//   totalRevenue: '₵ 542,000'
// }

// export const useAppStore = create<AppStore>()(
//   persist(
//     (set) => ({

//       fetchListings: async () => {
//         set({ loading: true, error: null })

//         try {
//           const q = query(collection(db, "listings"), orderBy("createdAt", "desc"))
//           const snapshot = await getDocs(q)

//           const listings = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           })) as Listing[]

//           set({
//             listings,
//             filteredListings: listings,
//             loading: false
//           })

//         } catch (err: any) {
//           set({ error: err.message, loading: false })
//         }
//       },

//       getListingById: async (id) => {
//         set({ loading: true })

//         try {
//           const ref = doc(db, "listings", id)
//           const snap = await getDoc(ref)

//           if (!snap.exists()) {
//             set({ error: "Listing not found", loading: false })
//             return
//           }

//           set({
//             selectedListing: { id: snap.id, ...snap.data() } as Listing,
//             loading: false
//           })

//         } catch (err: any) {
//           set({ error: err.message, loading: false })
//         }
//       },


// createListing: async (data) => {
//   try {
//     await addDoc(collection(db, "listings"), {
//       ...data,
//       createdAt: new Date()
//     })

//     await useAppStore.getState().fetchListings()

//     return { success: true }
//   } catch (err: any) {
//     return { success: false, error: err.message }
//   }
// },


// updateListing: async (id, data) => {
//   try {
//     const ref = doc(db, "listings", id)
//     await updateDoc(ref, {
//       ...data,
//       updatedAt: new Date()
//     })

//     await useAppStore.getState().fetchListings()

//     return { success: true }
//   } catch (err: any) {
//     return { success: false, error: err.message }
//   }
// },


// deleteListing: async (id) => {
//   try {
//     await deleteDoc(doc(db, "listings", id))

//     set((state) => ({
//       listings: state.listings.filter(item => item.id !== id),
//       filteredListings: state.filteredListings.filter(item => item.id !== id)
//     }))

//     return { success: true }
//   } catch (err: any) {
//     return { success: false, error: err.message }
//   }
// },



// applyFilters: () => {
//   const { listings, filters, searchQuery, activeTab } = useAppStore.getState()

//   let result = [...listings]

//   // Tab filter
//   // if (activeTab !== 'all') {
//   //   result = result.filter(item => item.category === activeTab)
//   // }

//   // Search
//   // if (searchQuery) {
//   //   result = result.filter(item => {
//   //     let name = `${item.brand} ${item.model} ${item.year}`
//   //     return name.toLowerCase().includes(searchQuery.toLowerCase())
//   //   })
//   // }

//   // Price
//   result = result.filter(item =>
//     Number(item.price) >= Number(filters.minVal) &&
//     Number(item.price) <= Number(filters.maxVal)
//   )

//   // Condition
//   if (filters.condition.new || filters.condition['slightly used'] || filters.condition.used) {
//     result = result.filter(item =>
//       (filters.condition.new && item.condition === 'new') ||
//       (filters.condition['slightly used'] && item.condition === 'slightly used') ||
//       (filters.condition.used && item.condition === 'used')
//     )
//   }

//   // Region
//   // if (filters.region) {
//   //   result = result.filter(item => item.region === filters.region)
//   // }

//   set({ filteredListings: result })
// },


//       // Listings state
//       listings: [],
//       filteredListings: [],
//       selectedListing: null,

//       // Authentication state
//       isAuthenticated: false,
//       user: null,
//       loading: false,
//       error: null,
      
//       setAuth: (user) => set({ 
//         isAuthenticated: true, 
//         user,
//         loading: false,
//         error: null
//       }),
      
//       clearAuth: () => set({ 
//         isAuthenticated: false, 
//         user: null,
//         loading: false,
//         error: null
//       }),
      
//       setLoading: (loading) => set({ loading }),
      
//       setError: (error) => set({ error }),
      
//       // Liked cars
//       likedCars: [],
//       toggleLike: (carId) => set((state) => ({
//         likedCars: state.likedCars.includes(carId)
//           ? state.likedCars.filter(id => id !== carId)
//           : [...state.likedCars, carId]
//       })),
      
//       // Search
//       searchQuery: '',
//       setSearchQuery: (query) => set({ searchQuery: query }),
      
//       // Tab
//       activeTab: 'all',
//       setActiveTab: (tab) => set({ activeTab: tab }),
      
//       // Filters
//       filters: defaultFilters,
//       setFilters: (newFilters) => set((state) => ({
//         filters: { ...state.filters, ...newFilters }
//       })),

//       resetFilters: () => set({ filters: defaultFilters }),
      
//       // Mobile UI
//       isFilterOpen: false,
//       setIsFilterOpen: (open) => set({ isFilterOpen: open }),
      
//       isMenuOpen: false,
//       setIsMenuOpen: (open) => set({ isMenuOpen: open }),
      
//       // User data
//       userData: defaultUser,
//       setUser: (newUser) => set((state) => ({
//         userData: { ...state.userData, ...newUser }
//       }))
//     }),
//     {
//       name: 'auto-world-store',
//       partialize: (state) => ({
//         likedCars: state.likedCars,
//         searchQuery: state.searchQuery,
//         activeTab: state.activeTab,
//         filters: state.filters,
//         user: state.user,
//       })
//     }
//   )
// )
