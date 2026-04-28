import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ViewLogPayload = {
  vehicleId: string;
  userId?:   string;
  isAnon:    boolean;
};

export const recordViewLog = async ({
  vehicleId,
  userId,
  isAnon,
}: ViewLogPayload): Promise<void> => {
  // Store under vehicles/{vehicleId}/views subcollection
  await addDoc(collection(db, 'listings', vehicleId, 'views'), {
    userId:    userId ?? null,
    isAnon,
    viewedAt:  serverTimestamp(),
  });
};