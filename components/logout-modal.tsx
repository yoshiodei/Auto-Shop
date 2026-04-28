'use client';

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { signOut } from '@/utils/auth/signOut/signOut';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/context/ShowToast';
import { se } from 'date-fns/locale';

export function LogoutModal({isModalOpen, onModalClose}: {isModalOpen: boolean, onModalClose: () => void}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut();
      showToast('Logged out successfully', 'success');
      setLoading(false);
      router.push('/main');
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
      showToast('Failed to log out', 'error');
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200" aria-describedby="weapon-form-description">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Log Out</DialogTitle>
          <DialogDescription id="weapon-form-description">
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4">
          <Button 
            type="button" 
            className="flex-1 bg-[#FF6B7A] hover:bg-[#FF5566] text-white" 
            onClick={handleLogout}
            disabled={loading}
          >
            {
                loading ?
                (<Loader2 className="animate-spin w-4 h-4" />) :
                'Log Out'
            }
          </Button>
          <Button type="button" variant="secondary" className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onModalClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
