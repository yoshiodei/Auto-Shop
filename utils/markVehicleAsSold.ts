import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { showToast } from "@/context/ShowToast";

export const markVehicleAsSold = async (vehicleId: string): Promise<void> => {
  
  if(!vehicleId){
    showToast('Unable to mark vehicle as sold. Please try again later', 'error'); 
    return
  };

  const vehicleRef = doc(db, "listings", vehicleId);

  await updateDoc(vehicleRef, {
    status: "sold",
    updatedAt: serverTimestamp(),
  });

  showToast('Vehicle marked as sold', 'success')
};