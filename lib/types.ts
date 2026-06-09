export interface VehicleData {
    id: string
    title: string
    year?: string
    brand?: string
    model?: string
    condition: 'new' | 'slightly used' | 'used'
    mileage: string
    price: string | number
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
    features: string[]
    category?: 'car' | 'bike'
    status?: 'available' | 'sold'
    images?: string[]
    imageUrls?: string[]
    coverImage?: string
    createdAt: any
    views?: string[]
    viewCount?: number
    isNegotiable: boolean
  }

export interface UserData {
    uid: string;
    fullName: string;
    email: string;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    createdAt: any;
    role?: string | undefined;
    provider?: string | undefined;
}

export interface Notification {
  id:        string;
  type:      string;
  title:     string;
  message:   string;
  vehicleId: string;
  imageUrl:  string | null;
  isRead:    boolean;
  createdAt: any;
}


export interface ChatRoom {
  id:            string;
  userId:        string;
  lastMessage:   string | null;
  lastMessageAt: any;
  // user profile joined in
  fullName:      string;
  photoURL:      string | null;
  isOnline:      boolean;
  lastSeen:      any;
};


export interface SelectedUser {
  uid:      string;
  fullName: string;
  photoURL: string | null;
  isOnline: boolean;
  lastSeen: any;
};


export interface Message {
  id:        string;
  text:      string;
  senderId:  string;
  isRead:    boolean;
  createdAt: any;
}

export interface ChatRoom {
  id:            string;
  userId:        string;
  fullName:      string;
  photoURL:      string | null;
  lastMessage:   string | null;
  lastMessageAt: any;
  isOnline:      boolean;
  lastSeen:      any;
}

export interface SelectedUser {
  uid:      string;
  fullName: string;
  photoURL: string | null;
  isOnline: boolean;
  lastSeen: any;
}

export interface Message {
  id:        string;
  text:      string;
  senderId:  string;
  isRead:    boolean;
  createdAt: any;
}

export interface ChatRoom {
  id:            string;
  userId:        string;
  fullName:      string;
  photoURL:      string | null;
  lastMessage:   string | null;
  lastMessageAt: any;
  isOnline:      boolean;
  lastSeen:      any;
}

export interface SelectedUser {
  uid:      string;
  fullName: string;
  photoURL: string | null;
  isOnline: boolean;
  lastSeen: any;
}

export interface ViewData {
  id?: string | null
  isAnon: boolean;
  userId: string | null;
  viewedAt: any;

}