'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { showToast } from '@/context/ShowToast';

type ShareVehicleModalProps = {
  isModalOpen: boolean;
  onModalClose: () => void;
  vehicleId: string;
  vehicleTitle: string;
};

export function ShareVehicleModal({
  isModalOpen,
  onModalClose,
  vehicleId,
  vehicleTitle,
}: ShareVehicleModalProps) {
  const [copied, setCopied] = useState(false);

  const vehicleUrl = `${window.location.origin}/vehicles/${vehicleId}`;
  const shareText  = `Check out this ${vehicleTitle} on AutoMarket: ${vehicleUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vehicleUrl);
      setCopied(true);
      showToast('Link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vehicleUrl)}`, '_blank');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Share Vehicle</DialogTitle>
          <DialogDescription>
            Share this vehicle with others via link or social media.
          </DialogDescription>
        </DialogHeader>

        {/* Copy link */}
        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg mt-2">
          <p className="flex-1 text-sm text-gray-600 truncate">{vehicleUrl}</p>
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900"
          >
            {copied
              ? <Check size={16} className="text-green-500" />
              : <Copy size={16} />
            }
          </button>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3 pt-2">
          <p className="text-sm text-gray-500">Share on</p>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            aria-label="Share on WhatsApp"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>

          {/* X (Twitter) */}
          <button
            onClick={handleX}
            aria-label="Share on X"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            aria-label="Share on Facebook"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full bg-gray-200 text-gray-900 hover:bg-gray-300 mt-2"
          onClick={onModalClose}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}