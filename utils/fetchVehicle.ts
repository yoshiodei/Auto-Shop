import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { VehicleData } from '@/lib/types'

export const fetchVehicle = async (id: string) => {

  try {

    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const vehicleData = { ...docSnap.data(), id } as VehicleData;
      return vehicleData;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    return null;
  }
}




