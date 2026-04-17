// Firebase services index
// Centralized exports for all Firebase-related services and utilities

// Auth services
export * from './auth';

// Vehicle services
export * from './vehicles';

// Messaging services
export * from './messaging';

// Storage services
export * from './storage';

// Config
export { firebaseConfig, COLLECTIONS, STORAGE_PATHS } from './config';

// Firebase instances
export { auth, db, storage, realtimeDb, default as firebaseApp } from './init';
