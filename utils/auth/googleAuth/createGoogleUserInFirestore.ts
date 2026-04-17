import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

export const createGoogleUserInFirestore = async (user: User, timestamp: any): Promise<void> => {
  const { uid, displayName, email, phoneNumber } = user;

  await setDoc(doc(db, "users", uid), {
    uid,
    fullName:  displayName  ?? "",
    email:     email?.toLowerCase() ?? "",
    phone:     phoneNumber  ?? null,
    location:  null,
    provider:  "google",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
};