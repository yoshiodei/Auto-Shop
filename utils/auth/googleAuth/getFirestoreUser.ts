import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getFirestoreUser = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }

  return null; // user does not exist in firestore
};