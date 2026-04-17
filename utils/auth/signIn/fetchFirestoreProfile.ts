import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
// import type { AuthUser } from "@/store/authStore"; 

interface AuthUser {
    uid: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: any; // Firestore timestamp
    location: string | null;
    provider: string;
}

export const fetchFirestoreProfile = async (uid: string): Promise<Omit<AuthUser, "token">> => {
  const userSnap = await getDoc(doc(db, "users", uid));

  if (!userSnap.exists()) throw new Error("User profile not found. Please contact support.");

  const data = userSnap.data();

  return {
    uid: data.uid,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone ?? null,
    role: data.role,
    createdAt: data.createdAt,
    location: data.location ?? null,
    provider: data.provider,
  };
};