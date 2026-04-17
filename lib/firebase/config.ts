// Firebase configuration file
// Replace these with your Firebase project credentials from Firebase Console
// https://console.firebase.google.com/

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  MESSAGES: 'messages',
  CHATS: 'chats',
  NOTIFICATIONS: 'notifications',
  REVIEWS: 'reviews',
  LISTINGS: 'listings',
};

// Storage paths
export const STORAGE_PATHS = {
  VEHICLE_IMAGES: 'vehicle-images',
  USER_AVATARS: 'user-avatars',
  CHAT_ATTACHMENTS: 'chat-attachments',
};
