'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { showToast } from '@/context/ShowToast';

type DeleteVehicleModalProps = {
  isModalOpen:  boolean;
  onModalClose: () => void;
  vehicleId:    string;
  imageUrls:    string[];   // all image URLs stored in Firebase Storage
  onSuccess?:   () => void; // e.g. redirect or refresh list after deletion
};

// Extract the storage path from a Firebase Storage download URL
const getStoragePathFromUrl = (url: string): string => {
  const decodedUrl = decodeURIComponent(url);
  const startIndex = decodedUrl.indexOf('/o/') + 3;
  const endIndex   = decodedUrl.indexOf('?');
  return decodedUrl.substring(startIndex, endIndex);
};

// Delete all images from Firebase Storage
const deleteVehicleImages = async (imageUrls: string[]): Promise<void> => {
  const deletePromises = imageUrls.map((url) => {
    const storagePath = getStoragePathFromUrl(url);
    const imageRef    = ref(storage, storagePath);
    return deleteObject(imageRef).catch((error) => {
      // Don't block deletion if an image is already gone
      console.warn(`Could not delete image at ${storagePath}:`, error.message);
    });
  });

  await Promise.all(deletePromises);
};

// Delete the vehicle doc from Firestore
const deleteVehicleDoc = async (vehicleId: string): Promise<void> => {
  await deleteDoc(doc(db, 'vehicles', vehicleId));
};

export function DeleteVehicleModal({
  isModalOpen,
  onModalClose,
  vehicleId,
  imageUrls,
  onSuccess,
}: DeleteVehicleModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // 1. Delete all images from Firebase Storage
      await deleteVehicleImages(imageUrls);

      // 2. Delete the vehicle document from Firestore
      await deleteVehicleDoc(vehicleId);

      showToast('Vehicle deleted successfully', 'success');
      onModalClose();
      onSuccess?.();
    } catch (error: any) {
      console.error(error.message);
      showToast('Failed to delete vehicle', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Delete Vehicle</DialogTitle>
          <DialogDescription>
            This will permanently delete this listing and all its images. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-[#FF6B7A] hover:bg-[#FF5566] text-white"
          >
            {loading
              ? <Loader2 className="animate-spin w-4 h-4" />
              : 'Delete'
            }
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300"
            onClick={onModalClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}