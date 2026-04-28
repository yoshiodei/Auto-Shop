import { doc, updateDoc, increment, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const incrementViewCount = async (vehicleId: string): Promise<void> => {
  const vehicleRef = doc(db, 'listings', vehicleId);
  const vehicleSnap = await getDoc(vehicleRef);

  if (!vehicleSnap.exists()) return;

  // Use Firestore's atomic increment — safe for concurrent views
  await updateDoc(vehicleRef, {
    viewCount: increment(1),
  });
};