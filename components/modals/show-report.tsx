'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { showToast } from '@/context/ShowToast';
import { deleteVehicle } from '@/utils/vehicles/deleteVehicle';
import { useRouter } from 'next/navigation';
import { deleteAdminRecord } from '@/utils/analytics/deleteAdminRecord';

type ShowReportModalProps = {
  isModalOpen:  boolean;
  onModalClose: () => void;
  selectedReport: any;
  router: any;
  onDelete: (id: string) => void;
  onResolved: (id: string) => void;
};

// Delete the vehicle doc from Firestore
const deleteVehicleDoc = async (vehicleId: string): Promise<void> => {
  await deleteDoc(doc(db, 'listings', vehicleId));
};

export function ShowReportModal({
  isModalOpen,
  onModalClose,
  selectedReport,
  router,
  onDelete,
  onResolved
}: ShowReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);
console.log("selected report", selectedReport);

const handleViewReporter = (reporterId: string) => {
  onModalClose();
  router.push(`/user/${reporterId}`);
}

const handleResolve = async (row: any) => {
  setResolveLoading(true);
  
  const resolveObject = {
    ...row,
    status: 'resolved'
  }

  await setDoc(doc(db, 'reports', row.id), resolveObject)
    .then(() => {
      onResolved(row.id);
      showToast('Report marked as resolved', 'success');
    })
    .catch((error) => {
      showToast('Failed to mark report as resolved', 'error');
      console.error('Error updating report status:', error);
    })
    .finally(() => {
      setResolveLoading(false);
      onModalClose();
    });

  setResolveLoading(false);
}


const handleDelete = async (id: string) => {
    setLoading(true)
    const result = await deleteAdminRecord('reports', id)

    if (!result.success) {
      showToast('Failed to delete report', 'error')
      setLoading(false)
      return
    }

    onDelete(id)
    showToast('Report deleted successfully', 'success')
    setLoading(false)
    onModalClose()
  }

  if (!selectedReport) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Report</DialogTitle>
          <DialogDescription>
            {selectedReport.reportType}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-gray-700 text-sm">{selectedReport.description}</p>
          <button
            onClick={() => handleViewReporter(selectedReport.reportedBy)}
            className="text-[#FF6B7A] hover:underline mt-2"
          >
            View Reporter
          </button>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={() => handleDelete(selectedReport.id)}
            disabled={loading}
            className="flex-1 bg-[#FF6B7A] hover:bg-[#FF5566] text-white"
          >
            {loading
              ? <Loader2 className="animate-spin w-4 h-4" />
              : 'Delete'
            }
          </Button>
          {selectedReport.status === 'pending' && (<Button
            type="button"
            variant="secondary"
            className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300"
            onClick={() => handleResolve(selectedReport)}
            disabled={resolveLoading}
          >
           { resolveLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Mark as resolved' }
          </Button>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}