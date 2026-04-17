import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const createFirebaseUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Attach display name to the auth profile
  await updateProfile(userCredential.user, { displayName: fullName });

  return userCredential.user;
};