import {
  doc, getDoc,
  setDoc, deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAppStore } from '@/store/app-store'

type DeleteVehicleResult = {
  success: boolean
  error?:  string
}

const getVehicleData = async (vehicleId: string) => {
  const snap = await getDoc(doc(db, 'listings', vehicleId))
  if (!snap.exists()) throw new Error('Vehicle not found.')
  return snap.data()
}

const copyToDeletedCollection = async (
  vehicleId:   string,
  vehicleData: Record<string, any>
): Promise<void> => {
  await setDoc(doc(db, 'deletedVehicles', vehicleId), {
    ...vehicleData,
    status:    'deleted',
    deletedAt: serverTimestamp(),
  })
}

const removeFromActiveVehicles = async (vehicleId: string): Promise<void> => {
  const newListing = await deleteDoc(doc(db, 'listings', vehicleId))
  //   setListings(newListing.data());
  console.log("Deleted vehicle:", newListing)
}

export const deleteVehicle = async (
  vehicleId: string
): Promise<DeleteVehicleResult> => {
  try {
    // 1. Fetch full vehicle data
    const vehicleData = await getVehicleData(vehicleId)

    // 2. Copy to deletedVehicles — always before removing
    await copyToDeletedCollection(vehicleId, vehicleData)

    // 3. Remove from active vehicles
    await removeFromActiveVehicles(vehicleId)

    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete vehicle:', error.message)
    return { success: false, error: error.message }
  }
}