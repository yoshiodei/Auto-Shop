import { signOut as firebaseSignOut } from "firebase/auth";
import { useAppStore } from "@/store/app-store";
import { auth } from "@/lib/firebase";

export const signOut = async (): Promise<void> => {
  // 1. Sign out from Firebase Auth
  await firebaseSignOut(auth);

  // 2. Clear user from Zustand
  useAppStore.getState().clearUser();
  useAppStore.getState().clearWishlist();
  useAppStore.getState().resetFilter();

};