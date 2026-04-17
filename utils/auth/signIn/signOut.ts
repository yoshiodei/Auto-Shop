import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { clearJWT } from "../generateJWT";
import { useAppStore } from "@/store/app-store";


export const signOut = async (): Promise<void> => {
  // 1. Sign out from Firebase Auth
  await firebaseSignOut(auth);

  // 3. Clear user from Zustand
  useAppStore.getState().clearUser();
};