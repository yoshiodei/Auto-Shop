import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

// Get or create a persistent anonymous device ID
export const getAnonId = (): string => {
  const existing = localStorage.getItem('anon_id');
  if (existing) return existing;

  const newId = `anon_${uuidv4()}`;
  localStorage.setItem('anon_id', newId);
  return newId;
};

export const addViewerId = async (
  vehicleId: string,
  viewerId: string       // userId for logged-in, anonId for anonymous
): Promise<void> => {
  const vehicleRef  = doc(db, 'listings', vehicleId);
  const vehicleSnap = await getDoc(vehicleRef);

  if (!vehicleSnap.exists()) return;

  const data    = vehicleSnap.data();
  const views = (data.views ?? []) as string[];

  // Don't add if already in the array
  if (views.includes(viewerId)) return;

  // arrayUnion safely adds without duplicates even with concurrent writes
  await updateDoc(vehicleRef, {
    views: arrayUnion(viewerId),
  });
};