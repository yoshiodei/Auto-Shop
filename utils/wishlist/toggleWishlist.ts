import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export const toggleWishlist = async (
  userId: string,
  vehicleId: string,
  isWishlisted: boolean
): Promise<void> => {
  // Store under users/{userId}/wishlist/{vehicleId}
  const wishlistRef = doc(db, "users", userId, "wishlist", vehicleId);

  if (isWishlisted) {
    // Already wishlisted — remove it
    await deleteDoc(wishlistRef);
  } else {
    // Not wishlisted — add it
    await setDoc(wishlistRef, {
      vehicleId,
      addedAt: serverTimestamp(),
    });
  }
};