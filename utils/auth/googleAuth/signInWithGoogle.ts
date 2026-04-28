import { getGoogleUser }                from "./getGoogleUser";
import { getFirestoreUser }             from "./getFirestoreUser";
import { createGoogleUserInFirestore }  from "./createGoogleUserInFirestore";
import { buildAuthUser }                from "./buildAuthUser";
import { generateAndStoreJWT } from "../generateJWT";
import { useAppStore } from "@/store/app-store";
import { serverTimestamp } from "firebase/firestore";
import { log } from "console";

export const signInWithGoogle = async (): Promise<void> => {
  // 1. Trigger Google popup and get Firebase user
  const googleUser = await getGoogleUser();

  // 2. Check if user already exists in Firestore
  const existingUser = await getFirestoreUser(googleUser.uid);

  await useAppStore.getState().loadWishlist(existingUser?.uid)

  const timestamp = serverTimestamp();

  // 3. If not, create a new Firestore doc for them
  if (!existingUser) {
    await createGoogleUserInFirestore(googleUser, timestamp);
  }


  // 5. Build AuthUser shape and save to Zustand
  const authUser = buildAuthUser(googleUser, timestamp);
  useAppStore.getState().setUser(authUser);
};