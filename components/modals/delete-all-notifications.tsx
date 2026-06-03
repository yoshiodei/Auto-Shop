'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { showToast } from '@/context/ShowToast';
import { deleteAllNotifications } from '@/utils/notifications/deleteNotification';


export function DeleteNotificationsModal({
  isModalOpen,
  onModalClose,
  uid
}: {isModalOpen: boolean; onModalClose: () => void, uid: string}) {

  const [loading, setLoading] = useState(false);

  const handleDeleteAllNotifications = async () => {
    setLoading(true);
    try {
      await deleteAllNotifications(uid);
      showToast('All notifications deleted successfully', 'success');
      onModalClose();
    } catch (error: any) {
      console.error(error.message);
      showToast('Failed to delete notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Delete All Notifications</DialogTitle>
          <DialogDescription>
            This will permanently delete all your notifications. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={handleDeleteAllNotifications}
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