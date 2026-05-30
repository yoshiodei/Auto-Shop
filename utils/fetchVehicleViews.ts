import { db } from "@/lib/firebase";
import { ViewData } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";


export const fetchViews = async (vehicleId: string) => {
  try {
    const viewsRef = collection(db, "listings", vehicleId, "views");

    const snapshot = await getDocs(viewsRef);

    const views = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ViewData[];

    // console.log(views);s

    if(!views || undefined) return [];

    return views;
  } catch (error) {
    console.error(error);
  }
};