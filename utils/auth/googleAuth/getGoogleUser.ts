import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

// Optional: prompt account selection every time even if already signed in
provider.setCustomParameters({ prompt: "select_account" });

export const getGoogleUser = async () => {
    
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};