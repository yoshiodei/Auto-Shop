import {
  doc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage'
import { db, storage } from '@/lib/firebase'

type ImageItem =
  | { type: 'existing'; url: string; preview: string }
  | { type: 'new';      file: File;  preview: string }

const getStoragePathFromUrl = (url: string): string => {
  const decoded  = decodeURIComponent(url)
  const start    = decoded.indexOf('/o/') + 3
  const end      = decoded.indexOf('?')
  return decoded.substring(start, end)
}

export const updateVehicle = async (
  vehicleId:  string,
  formData:   Record<string, any>,
  images:     ImageItem[],
  coverIndex: number,
  category:   'car' | 'bike'
): Promise<void> => {

  // Separate existing from new images
  const existingImages = images.filter((img) => img.type === 'existing') as { type: 'existing'; url: string; preview: string }[]
  const newImages      = images.filter((img) => img.type === 'new')      as { type: 'new'; file: File; preview: string }[]

  // Fetch current images from Firestore to find removed ones
  const vehicleRef  = doc(db, 'listings', vehicleId)
  const existingUrls = existingImages.map((img) => img.url)

  // Upload new images to Storage
  const uploadedUrls = await Promise.all(
    newImages.map(async (img) => {
      const path      = `vehicles/${vehicleId}/${Date.now()}_${img.file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, img.file)
      return getDownloadURL(storageRef)
    })
  )

  // Final image array preserving order
  const finalImages = images.map((img) => {
    if (img.type === 'existing') return img.url
    // Map new image back to its uploaded URL by matching file reference
    const idx = newImages.findIndex((n) => n === img)
    return uploadedUrls[idx]
  })

  // Update Firestore doc
  await updateDoc(vehicleRef, {
    ...formData,
    category,
    images:     finalImages,
    coverImage: finalImages[coverIndex] ?? finalImages[0],
    coverIndex,
    updatedAt:  serverTimestamp(),
  })
}