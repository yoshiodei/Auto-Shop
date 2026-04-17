// Authentication service functions
// Handles user sign up, sign in, sign out, password reset, and session management

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  User,
} from 'firebase/auth';
import { auth, db } from './init';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from './config';

// Type definitions
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  location?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  rating: number;
  reviews: number;
  sold: number;
  listings: number;
  totalViews: number;
  avgResponseTime: string;
  totalRevenue: string;
  joined: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sign up a new user
export const signUpUser = async (data: SignUpData): Promise<User> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: data.name,
    });

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      name: data.name,
      phone: data.phone || '',
      location: data.location || '',
      rating: 5.0,
      reviews: 0,
      sold: 0,
      listings: 0,
      totalViews: 0,
      avgResponseTime: 'N/A',
      totalRevenue: '₵ 0',
      joined: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile);

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Sign in user
export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    // Enable persistence
    await setPersistence(auth, browserLocalPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset email');
  }
};

// Get current user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    await setDoc(
      doc(db, COLLECTIONS.USERS, uid),
      {
        ...updates,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

// Check if user exists
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    // This would typically be done via a backend function
    // For now, we'll return false and implement on backend
    return false;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to check user');
  }
};
