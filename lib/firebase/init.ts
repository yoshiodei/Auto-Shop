// Firebase initialization
// This file initializes Firebase and exports database, auth, and storage instances

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './config';

// Check if Firebase app is already initialized
const apps = getApps();
const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

export default app;