// import { Timestamp } from "firebase/firestore";
import { fetchUserWishlist } from "@/utils/wishlist/fetchUserWishlist";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toggleWishlist } from "@/utils/wishlist/toggleWishlist";

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
    imagesUrls: string[]
    coverImage: string
    createdAt: any
    category: 'bike' | 'car'
    views?: string[]
    viewCount?: number
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

     wishlistedIds:   string[];
    isLoading:       boolean;
    loadWishlist:    (userId: string) => Promise<void>;
    toggleItem:      (userId: string, vehicleId: string) => Promise<void>;
    isWishlisted:    (vehicleId: string) => boolean;
    clearWishlist:   () => void;


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

  wishlistedIds: [],

  isLoading: false,

  loadWishlist: async (userId) => {
    set({ isLoading: true });
    const ids = await fetchUserWishlist(userId);
    set({ wishlistedIds: ids, isLoading: false });
  },

  toggleItem: async (userId, vehicleId) => {
        const { wishlistedIds } = get();
        const isCurrentlyWishlisted = wishlistedIds.includes(vehicleId);

        // Optimistic update — update UI instantly before Firestore responds
        set({
          wishlistedIds: isCurrentlyWishlisted
            ? wishlistedIds.filter((id) => id !== vehicleId)
            : [...wishlistedIds, vehicleId],
        });

        try {
          await toggleWishlist(userId, vehicleId, isCurrentlyWishlisted);
        } catch (error) {
          // Revert if Firestore write fails
          set({ wishlistedIds });
          throw error;
        }
    },

    isWishlisted: (vehicleId) => get().wishlistedIds.includes(vehicleId),

    clearWishlist: () => set({ wishlistedIds: [] }),

}),
{
  name: 'auto-world-store',

  partialize: (state) => ({
    filter: state.filter,
    user: state.user,
    wishlistedIds: state.wishlistedIds,
  })
}
));

