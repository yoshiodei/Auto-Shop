"use client";

import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { showToast } from '@/context/ShowToast';

type WishlistButtonProps = {
  vehicleId: string;
};

const WishlistButton = ({ vehicleId }: WishlistButtonProps) => {

  const [isMouseOver, setIsMouseOver] = useState(false);  

  const { handleToggle, isWishlisted } = useWishlistToggle();
  const userData = useAppStore((state) => state.user);
  const onModalOpen = useAppStore((state) => state.setModalOpen);

  const liked = isWishlisted(vehicleId);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userData) {
      onModalOpen();
      return;
    }


    handleToggle(vehicleId, e);

    if (!liked) {
      showToast("Added to wishlist!", "success");
    } else {
      showToast("Removed from wishlist!", "default");
    }
  }

  return (
     <button
          onClick={handleLikeClick}
            className="absolute z-10 top-3 right-3 bg-white p-1 rounded cursor-pointer"
            onMouseOver={() => setIsMouseOver(true)} 
            onMouseOut={() => setIsMouseOver(false)}
        >
          <Heart
            className={`w-4 h-4 transition-colors fill-[#ffffff] text-[#FF6B7A] transition-colors duration-300`}
            
            fill={isMouseOver || liked ? 'currentColor' : 'none'}
          />
        </button>
  );
  

// return (
//     <button
//       onClick={handleLikeClick}
//       aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
//       className={`p-2 rounded-full transition-colors ${
//         wishlisted
//           ? "bg-red-50 text-red-500"
//           : "bg-white/80 text-gray-400 hover:text-red-400"
//       }`}
//     >
//       <svg
//         width="20"
//         height="20"
//         viewBox="0 0 24 24"
//         fill={wishlisted ? "currentColor" : "none"}
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//       </svg>
//     </button>
//   );
};

export default WishlistButton;