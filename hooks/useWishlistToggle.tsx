import { useRouter }        from "next/navigation";
import { useAppStore }     from "@/store/app-store";
import { showToast } from "@/context/ShowToast";
// import { useWishlistStore } from "@/store/wishlistStore";

export const useWishlistToggle = () => {
  const user   = useAppStore((state) => state.user);
  const toggleItem = useAppStore((state) => state.toggleItem);
  const isWishlisted = useAppStore((state) => state.isWishlisted);

  const handleToggle = async (
    vehicleId: string,
    e: React.MouseEvent  
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('You are not logged in', 'default');
      return;
    }

    try {
      await toggleItem(user.uid, vehicleId);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return { handleToggle, isWishlisted };
};