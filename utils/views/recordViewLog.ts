import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ViewLogPayload = {
  vehicleId: string;
  viewerId:  string; // userId or anonId
  isAnon:    boolean;
};

export const recordViewLog = async ({
  vehicleId,
  viewerId,
  isAnon,
}: ViewLogPayload): Promise<void> => {
  await addDoc(collection(db, 'listings', vehicleId, 'views'), {
    viewerId,
    isAnon,
    viewedAt: serverTimestamp(),
  });
};