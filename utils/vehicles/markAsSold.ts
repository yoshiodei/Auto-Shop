import {
  doc, getDoc,
  setDoc, deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { showToast } from '@/context/ShowToast'

type MarkAsSoldResult = {
  success: boolean
  error?:  string
}

// Fetch the full vehicle doc
const getVehicleData = async (vehicleId: string) => {
  const snap = await getDoc(doc(db, 'listings', vehicleId))
  if (!snap.exists()) throw new Error('Vehicle not found.')
  return snap.data()
}

// Copy vehicle to soldVehicles collection with sold metadata
const copyToSoldCollection = async (
  vehicleId:   string,
  vehicleData: Record<string, any>
): Promise<void> => {
  await setDoc(doc(db, 'soldVehicles', vehicleId), {
    ...vehicleData,
    status:  'sold',
    soldAt:  serverTimestamp(),
  })
}

// Remove from active vehicles collection
const removeFromActiveVehicles = async (vehicleId: string): Promise<void> => {
  await deleteDoc(doc(db, 'listings', vehicleId))
}

export const markVehicleAsSold = async (
  vehicleId: string
): Promise<MarkAsSoldResult> => {
  try {
    // 1. Fetch full vehicle data
    const vehicleData = await getVehicleData(vehicleId)

    // 2. Copy to soldVehicles — do this first so data is never lost
    await copyToSoldCollection(vehicleId, vehicleData)

    // 3. Remove from active vehicles
    await removeFromActiveVehicles(vehicleId)

    showToast('Successfully marked vehicle as sold','success')

    return { success: true }
  } catch (error: any) {
    console.error('Failed to mark vehicle as sold:', error.message)
    return { success: false, error: error.message }
  }
}