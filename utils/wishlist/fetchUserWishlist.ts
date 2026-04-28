import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchUserWishlist = async (userId: string): Promise<string[]> => {
  const wishlistSnap = await getDocs(
    collection(db, "users", userId, "wishlist")
  );

  return wishlistSnap.docs.map((doc) => doc.id); // returns array of vehicleIds
};