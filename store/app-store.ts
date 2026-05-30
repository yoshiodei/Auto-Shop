// import { Timestamp } from "firebase/firestore";
import { fetchUserWishlist } from "@/utils/wishlist/fetchUserWishlist";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toggleWishlist } from "@/utils/wishlist/toggleWishlist";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { Notification, VehicleData } from "@/lib/types";

interface FilterState {
    category: string;
    minPrice: number;
    maxPrice: number;
    region: string;  
    town: string;
    condition: {new: boolean; 'slightly used': boolean; used: boolean};
    transmission: { manual: boolean; automatic: boolean };
    fuelType: { petrol: boolean; diesel: boolean; electric: boolean; hybrid: boolean };
  }

export interface GlobalState {
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void

  isFilterActive: boolean

  pendingFilter: FilterState,
  appliedFilter: FilterState,

  setPendingFilter:  (filters: Partial<FilterState>) => void
  applyFilter:      () => void
  resetFilter:      (maxPrice:number) => void

  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;

  setLocation: (region: string, town: string) => void;
  setCondition: (condition: 'new' | 'slightly used' | 'used') => void;
  setTransmission: (transmission: 'manual' | 'automatic') => void;
  setFuelType: (fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid') => void;

  vehicles: VehicleData[];
  
  // setListings: (listings: GlobalState['vehicles']) => void;
  setListings: (listings: VehicleData[]) => void;
  removeListing: (id: string) => void;
  addListing: (vehicle: VehicleData) => void;
  updateListing: (id: string, updatedData: Partial<VehicleData>) => void;

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

  notifications:  Notification[];
  notificationUnreadCount:    number;
  isLoadingNotification:      boolean;
  subscribeToNotifications: (userId: string) => () => void; // returns unsubscribe fn
  setNotifications:         (notifications: Notification[]) => void;
  clearNotifications:       () => void;


  roomId:         string | null
  unreadChatCount:    number
  setRoomId:      (roomId: string | null) => void
  setUnreadChatCount: (count: number) => void
  clearChat:      () => void
}

const defaultFilter = {
    category: '',
    minPrice: 0,
    maxPrice: 50000,
    region: '',
    town: '',
    condition: {new: false, 'slightly used': false, used: false},
    transmission: { manual: false, automatic: false },
    fuelType: { petrol: false, diesel: false, electric: false, hybrid: false },
}

export const useAppStore = create<GlobalState>()(
  persist(
  (set, get) => ({

  isFilterActive: false,

  // filter: {
  //   minPrice: 0,
  //   maxPrice: 500000,
  //   region: '',
  //   town: '',
  //   condition: {new: false, 'slightly used': false, used: false},
  //   transmission: { manual: false, automatic: false },
  //   fuelType: { petrol: false, diesel: false, electric: false, hybrid: false },
  // },

  pendingFilter: defaultFilter,
  appliedFilter: defaultFilter,

  setPendingFilter: (filters) => {
    set({
      pendingFilter: { ...get().pendingFilter, ...filters }
    })
  },

  applyFilter: () =>{
    set({
      appliedFilter: { ...get().pendingFilter },
      isFilterActive: true,
    })
  },

  resetFilter: (maxPrice: number) => {
    set({
      pendingFilter: { ...defaultFilter, maxPrice },
      appliedFilter: { ...defaultFilter, maxPrice },
      isFilterActive: false,
  })},

  setMinPrice: (price: number) => set({ pendingFilter: { ...get().pendingFilter, minPrice: price } }),
  setMaxPrice: (price: number) => set({ pendingFilter: { ...get().pendingFilter, maxPrice: price } }),
  setLocation: (region: string, town: string) => set({ pendingFilter: { ...get().pendingFilter, region, town } }),

  setCondition: (condition: 'new' | 'slightly used' | 'used') => {
    const current = get().pendingFilter.condition[condition];
    set({ pendingFilter: { ...get().pendingFilter, condition: { ...get().pendingFilter.condition, [condition]: !current } } });
  },

  setTransmission: (transmission: 'manual' | 'automatic') => {
    const current = get().pendingFilter.transmission[transmission];
    set({ pendingFilter: { ...get().pendingFilter, transmission: { ...get().pendingFilter.transmission, [transmission]: !current } } });
  },

  setFuelType: (fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid') => {
    const current = get().pendingFilter.fuelType[fuelType];
    set({ pendingFilter: { ...get().pendingFilter, fuelType: { ...get().pendingFilter.fuelType, [fuelType]: !current } } });
  },

isFilterOpen: false,

setIsFilterOpen: (open: boolean) => set({ isFilterOpen: open }),

vehicles:[],

// setListings: (listings: GlobalState['vehicles']) => set({ vehicles: listings }),
setListings: (listings) => set({ vehicles: listings }),
removeListing: (id: string) => set({ vehicles: get().vehicles.filter(v => v.id !== id) }),
updateListing: (id: string, updatedData: Partial<VehicleData>) => set({ vehicles: get().vehicles.map(v => v.id === id ? { ...v, ...updatedData } : v) }),
addListing: (vehicle) => set({ vehicles: [vehicle, ...get().vehicles] }),

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

  notifications: [],
  notificationUnreadCount:   0,
  isLoadingNotification: false,

  // Real-time listener — call on login, unsubscribe on logout
  subscribeToNotifications: (userId) => {
    const q = query(
      collection(db, 'users', userId, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const notifications = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      set({
        notifications,
        notificationUnreadCount: notifications.filter((n) => !n.isRead).length,
        isLoadingNotification:   false,
      });
    });

    return unsubscribe; // call this to stop listening
  },

  setNotifications:   (notifications) => set({ notifications }),
  clearNotifications: () => set({ notifications: [], notificationUnreadCount: 0 }),

  roomId:         null,
  unreadChatCount:    0,
  setRoomId:      (roomId)      => set({ roomId }),
  setUnreadChatCount: (unreadChatCount) => set({ unreadChatCount }),
  clearChat:      ()            => set({ roomId: null, unreadChatCount: 0 }),

}),
{
  name: 'auto-world-store',

  partialize: (state) => ({
    // filter: state.filter,
    user: state.user,
    wishlistedIds: state.wishlistedIds,
    notifications: state.notifications,
    unreadChatCount: state.unreadChatCount,
    roomId: state.roomId,
  })
}
));

