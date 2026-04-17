// Vehicle/Listing service functions
// Handles posting, updating, deleting, and fetching vehicle listings

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  QueryConstraint,
  getDoc,
  setDoc,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './init';
import { COLLECTIONS, STORAGE_PATHS } from './config';

// Type definitions
export interface Vehicle {
  id: string;
  uid: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  location: string;
  condition: 'new' | 'pre-owned';
  transmission: 'manual' | 'automatic' | 'electric';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  engine: string;
  seats: number;
  description: string;
  features: string[];
  images: string[];
  views: number;
  likes: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'sold' | 'archived';
}

export interface PostVehicleData {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  location: string;
  condition: 'new' | 'pre-owned';
  transmission: 'manual' | 'automatic' | 'electric';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  engine: string;
  seats: number;
  description: string;
  features: string[];
  images?: File[];
}

// Post a new vehicle
export const postVehicle = async (
  uid: string,
  data: PostVehicleData
): Promise<string> => {
  try {
    const imageUrls: string[] = [];

    // Upload images if provided
    if (data.images && data.images.length > 0) {
      for (const image of data.images) {
        const storageRef = ref(
          storage,
          `${STORAGE_PATHS.VEHICLE_IMAGES}/${uid}/${Date.now()}-${image.name}`
        );
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
    }

    // Create vehicle document
    const vehicleData: Omit<Vehicle, 'id'> = {
      uid,
      ...data,
      images: imageUrls,
      views: 0,
      likes: 0,
      featured: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.VEHICLES), vehicleData);
    
    // Update user's listing count
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      listings: increment(1),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to post vehicle');
  }
};

// Get all vehicles
export const getAllVehicles = async (
  constraints: QueryConstraint[] = [],
  pageLimit: number = 20
): Promise<Vehicle[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('status', '==', 'active'),
      ...constraints,
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );

    const querySnapshot = await getDocs(q);
    const vehicles: Vehicle[] = [];

    querySnapshot.forEach((doc) => {
      vehicles.push({
        id: doc.id,
        ...doc.data(),
      } as Vehicle);
    });

    return vehicles;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch vehicles');
  }
};

// Get user's vehicles
export const getUserVehicles = async (uid: string): Promise<Vehicle[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const vehicles: Vehicle[] = [];

    querySnapshot.forEach((doc) => {
      vehicles.push({
        id: doc.id,
        ...doc.data(),
      } as Vehicle);
    });

    return vehicles;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user vehicles');
  }
};

// Get single vehicle
export const getVehicle = async (vehicleId: string): Promise<Vehicle | null> => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.VEHICLES, vehicleId));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Vehicle;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch vehicle');
  }
};

// Update vehicle
export const updateVehicle = async (
  vehicleId: string,
  updates: Partial<Vehicle>
): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.VEHICLES, vehicleId), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update vehicle');
  }
};

// Delete vehicle
export const deleteVehicle = async (vehicleId: string, uid: string): Promise<void> => {
  try {
    // Get vehicle to delete images
    const vehicle = await getVehicle(vehicleId);
    
    if (vehicle) {
      // Delete images from storage
      for (const imageUrl of vehicle.images) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (err) {
          // Continue if image deletion fails
          console.error('[v0] Failed to delete image:', err);
        }
      }
    }

    // Delete vehicle document
    await deleteDoc(doc(db, COLLECTIONS.VEHICLES, vehicleId));

    // Update user's listing count
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      listings: increment(-1),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete vehicle');
  }
};

// Increment vehicle views
export const incrementVehicleViews = async (vehicleId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.VEHICLES, vehicleId), {
      views: increment(1),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to increment views');
  }
};

// Search vehicles by filters
export const searchVehicles = async (filters: {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
}): Promise<Vehicle[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'active'),
    ];

    if (filters.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.condition) {
      constraints.push(where('condition', '==', filters.condition));
    }
    if (filters.fuelType) {
      constraints.push(where('fuelType', '==', filters.fuelType));
    }
    if (filters.transmission) {
      constraints.push(where('transmission', '==', filters.transmission));
    }

    return getAllVehicles(constraints);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search vehicles');
  }
};
