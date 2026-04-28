'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showToast } from '@/context/ShowToast';
import { useAppStore } from '@/store/app-store';

const REPORT_TYPES = [
  'Fraudulent listing',
  'Incorrect information',
  'Duplicate listing',
  'Offensive content',
  'Vehicle already sold',
  'Suspected scam',
  'Other',
];

type ReportVehicleModalProps = {
  isModalOpen:  boolean;
  onModalClose: () => void;
  vehicleId:    string;
};

export function ReportVehicleModal({
  isModalOpen,
  onModalClose,
  vehicleId,
}: ReportVehicleModalProps) {
  const user = useAppStore((state) => state.user);

  const [reportType,   setReportType]   = useState('');
  const [description,  setDescription]  = useState('');
  const [loading,      setLoading]      = useState(false);

  const isValid = reportType !== '' && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reports'), {
        vehicleId,
        reportType,
        description:  description.trim(),
        reportedBy:   user?.uid ?? 'anonymous',
        status:       'pending',
        createdAt:    serverTimestamp(),
      });

      showToast('Report submitted successfully', 'success');
      setReportType('');
      setDescription('');
      onModalClose();
    } catch (error: any) {
      console.error(error.message);
      showToast('Failed to submit report', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Report Vehicle</DialogTitle>
          <DialogDescription>
            Let us know what's wrong with this listing and we'll look into it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">

          {/* Report type dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Report type <span className="text-red-500">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="" disabled>Select a reason</option>
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">
              {description.length} / 500
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="flex-1 bg-[#FF6B7A] hover:bg-[#FF5566] text-white disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="animate-spin w-4 h-4" />
              : 'Submit report'
            }
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300"
            onClick={onModalClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}