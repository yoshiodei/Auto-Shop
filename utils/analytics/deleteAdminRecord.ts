import { doc, getDoc, deleteDoc }      from 'firebase/firestore'
import { ref, deleteObject }           from 'firebase/storage'
import { db, storage }                 from '@/lib/firebase'

type DeleteResult = {
  success: boolean
  error?:  string
}

const getStoragePathFromUrl = (url: string): string => {
  const decoded = decodeURIComponent(url)
  const start   = decoded.indexOf('/o/') + 3
  const end     = decoded.indexOf('?')
  return decoded.substring(start, end)
}

const deleteImagesFromStorage = async (imageUrls: string[]): Promise<void> => {
  if (!imageUrls?.length) return

  const deletePromises = imageUrls.map((url) => {
    try {
      const path     = getStoragePathFromUrl(url)
      const imageRef = ref(storage, path)
      return deleteObject(imageRef).catch((error) => {
        // Don't block if image is already gone
        console.warn(`Could not delete image at ${path}:`, error.message)
      })
    } catch (error: any) {
      console.warn(`Invalid image URL skipped:`, error.message)
      return Promise.resolve()
    }
  })

  await Promise.all(deletePromises)
}

export const deleteAdminRecord = async (
  collectionName: 'soldVehicles' | 'deletedVehicles' | 'reports',
  docId:          string
): Promise<DeleteResult> => {
  try {
    // Reports have no images — skip straight to doc deletion
    if (collectionName === 'reports') {
      await deleteDoc(doc(db, collectionName, docId))
      return { success: true }
    }

    // For soldVehicles and deletedVehicles — delete images first
    const snap = await getDoc(doc(db, collectionName, docId))

    if (snap.exists()) {
      const data      = snap.data()
      const imageUrls = data.images ?? []

      // 1. Delete all images from Firebase Storage
      await deleteImagesFromStorage(imageUrls)
    }

    // 2. Delete the Firestore doc
    await deleteDoc(doc(db, collectionName, docId))

    return { success: true }
  } catch (error: any) {
    console.error(`Failed to delete from ${collectionName}:`, error.message)
    return { success: false, error: error.message }
  }
}