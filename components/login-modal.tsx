'use client';

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { use } from 'react';
import { useAppStore } from '@/store/app-store';

export function LoginModal() {
  const router = useRouter();
  const onModalClose = useAppStore((state) => state.setModalClose);
  const isModalOpen = useAppStore((state) => state.isModalOpen)

  const handleClick = () => {
    router.push('/auth/signin')
    onModalClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200" aria-describedby="weapon-form-description">
        <DialogHeader>
          <DialogTitle className="text-gray-900">You are not logged in</DialogTitle>
          <DialogDescription id="weapon-form-description">
            Please log in to access this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4">
          <Button 
            type="button" 
            className="flex-1 bg-[#FF6B7A] hover:bg-[#FF5566] text-white" 
            onClick={handleClick}
        >
            Log In
          </Button>
          <Button type="button" variant="secondary" className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onModalClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
