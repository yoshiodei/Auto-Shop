import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type SaveUserPayload = {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  role: 'user' | 'admin';
  timeStamp: any; // serverTimestamp() returns a special object, so we use 'any' here
};

export const saveUserToFirestore = async (payload: SaveUserPayload): Promise<void> => {
  const { uid, fullName, email, phone, location, timeStamp } = payload;

  await setDoc(doc(db, "users", uid), {
    uid,
    fullName,
    email: email.toLowerCase(),
    phone: phone ?? null,
    location: location ?? null,
    createdAt: timeStamp,
    updatedAt: timeStamp,
  });
};