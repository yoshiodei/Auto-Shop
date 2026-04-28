import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserData } from '@/lib/types'



export const fetchUser = async (id: string) => {

  try {

    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const userData = { ...docSnap.data(), uid: id } as UserData;
      return userData;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}