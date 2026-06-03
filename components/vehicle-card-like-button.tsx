// "use client";

// import { Heart } from 'lucide-react'
// import { useState } from 'react'
// import { useAppStore } from '@/store/app-store'
// import { useWishlistToggle } from "@/hooks/useWishlistToggle";
// import { showToast } from '@/context/ShowToast';

// type WishlistButtonProps = {
//   vehicleId: string;
// };

// const WishlistButton = ({ vehicleId }: WishlistButtonProps) => {

//   const [isMouseOver, setIsMouseOver] = useState(false);  

//   const { handleToggle, isWishlisted } = useWishlistToggle();
//   const userData = useAppStore((state) => state.user);
//   const onModalOpen = useAppStore((state) => state.setModalOpen);

//   const liked = isWishlisted(vehicleId);

//   const handleLikeClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!userData) {
//       onModalOpen();
//       return;
//     }


//     handleToggle(vehicleId, e);

//     if (!liked) {
//       showToast("Added to wishlist!", "success");
//     } else {
//       showToast("Removed from wishlist!", "default");
//     }
//   }

//   return (
//      <button
//           onClick={handleLikeClick}
//             className="absolute z-10 top-3 right-3 bg-white p-1 rounded cursor-pointer"
//             onMouseOver={() => setIsMouseOver(true)} 
//             onMouseOut={() => setIsMouseOver(false)}
//         >
//           <Heart
//             className={`w-4 h-4 transition-colors fill-[#ffffff] text-[#FF6B7A] transition-colors duration-300`}
            
//             fill={isMouseOver || liked ? 'currentColor' : 'none'}
//           />
//         </button>
//   );
// };

// export default WishlistButton;

"use client";

import { Heart }             from 'lucide-react'
import { useAppStore }       from '@/store/app-store'
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { showToast }         from '@/context/ShowToast';

type WishlistButtonProps = {
  vehicleId: string;
};

const WishlistButton = ({ vehicleId }: WishlistButtonProps) => {
  const { handleToggle, isWishlisted } = useWishlistToggle();
  const userData  = useAppStore((state) => state.user);
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
      className="absolute z-10 top-3 right-3 bg-white p-1 rounded cursor-pointer group"
    >
      <Heart
        className={`w-4 h-4 transition-colors duration-300 ${
          liked
            ? 'fill-[#FF6B7A] text-[#FF6B7A]'
            : 'fill-none text-[#FF6B7A] group-hover:fill-[#FF6B7A]'
        }`}
      />
    </button>
  );
};

export default WishlistButton;