'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showToast } from '@/context/ShowToast';
import { markVehicleAsSold } from '@/utils/vehicles/markAsSold';
import { useRouter } from 'next/navigation';

type MarkAsSoldModalProps = {
  isModalOpen:  boolean;
  onModalClose: () => void;
  vehicleId:    string;
  onSuccess?:   () => void;
  router: any; // Next.js router for navigation after marking as sold
};

// Fetch the full vehicle doc
const getVehicleDoc = async (vehicleId: string) => {
  const snap = await getDoc(doc(db, 'listings', vehicleId));
  if (!snap.exists()) throw new Error('Vehicle not found.');
  return snap.data();
};

// Copy vehicle to 'soldVehicles' collection with sold metadata
const copyToSoldVehicles = async (
  vehicleId: string,
  vehicleData: Record<string, any>
): Promise<void> => {
  await setDoc(doc(db, 'soldVehicles', vehicleId), {
    ...vehicleData,
    status: 'sold',
    soldAt: serverTimestamp(),
  });
};

// Remove from active 'vehicles' collection
const removeFromVehicles = async (vehicleId: string): Promise<void> => {
  await deleteDoc(doc(db, 'listings', vehicleId));
};

export function MarkAsSoldModal({
  isModalOpen,
  onModalClose,
  vehicleId,
  onSuccess,
  router
}: MarkAsSoldModalProps) {
  const [loading, setLoading] = useState(false);

  const handleMarkAsSold = async () => {
    setLoading(true);
    try {
      await markVehicleAsSold(vehicleId);
      showToast('Vehicle marked as sold', 'success');
      onModalClose();
      onSuccess?.();
      router.push('/main');
    } catch (error: any) {
      console.error(error.message);
      showToast('Failed to mark vehicle as sold', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Mark as Sold</DialogTitle>
          <DialogDescription>
            This will move the listing to your sold vehicles and remove it from
            the active listings. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={handleMarkAsSold}
            disabled={loading}
            className="flex-1 bg-[#FF6B7A] hover:bg-[#FF5566] text-white"
          >
            {loading
              ? <Loader2 className="animate-spin w-4 h-4" />
              : 'Mark as sold'
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