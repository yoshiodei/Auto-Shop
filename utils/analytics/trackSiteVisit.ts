// src/lib/analytics/trackSiteVisit.ts
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const trackSiteVisit = async (): Promise<void> => {
  try {
    await addDoc(collection(db, 'siteVisits'), {
      visitedAt: serverTimestamp(),
    })
  } catch {
    // Never block the user if tracking fails
  }
}