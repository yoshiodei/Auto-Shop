'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { showToast } from '@/context/ShowToast';
import { deleteVehicle } from '@/utils/vehicles/deleteVehicle';
import { useRouter } from 'next/navigation';
import { Notification } from '@/lib/types';
import { deleteNotification } from '@/utils/notifications/deleteNotification';



type NotificationModalProps = {
  isModalOpen:  boolean;
  onModalClose: () => void;
  notificationData: Notification | null;
  router: any; // Next.js router for navigation after deletion
  uid: string
};



export function NotificationModal({
  isModalOpen,
  onModalClose,
  notificationData,
  router,
  uid
}: NotificationModalProps) {
    
  const [loading, setLoading] = useState(false);

  const handleViewVehicle = (vehicleId: string) => {
    onModalClose();
    router.push(`/vehicle/${vehicleId}`);
  }  

  const handleDeleteNotification = async (notificationId: string) => {
    setLoading(true);
    try {
      await deleteNotification(uid || '', notificationId);
      showToast('Notification deleted', 'success');
      onModalClose();
    } catch (error: any) {
      showToast('Failed to delete notification', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!notificationData) return null;
  
  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{notificationData?.title}</DialogTitle>
          <DialogDescription>
            {notificationData?.message}
          </DialogDescription>
        </DialogHeader>

        {(notificationData?.imageUrl || notificationData.type === 'new_vehicle') && (
          <div className="w-full flex items-center justify-center">  
            <img
              src={notificationData?.imageUrl || ''}
              alt=""
              className="w-full rounded-lg object-cover shrink-0 border border-gray-200"
              style={{width: '70%', height: 100, backgroundColor: 'lightgray'}}
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={() => handleViewVehicle(notificationData.vehicleId)}
            disabled={loading}
            className="flex-1 bg-black text-white"
          >
            'View Vehicle'
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteNotification(notificationData.id)}
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