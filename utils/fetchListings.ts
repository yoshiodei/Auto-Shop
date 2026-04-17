import { db } from "@/lib/firebase";
import { VehicleData } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";

interface Listing {
  id: string
    title: string
    year?: string
    brand?: string
    model?: string
    condition: 'new' | 'slightly used' | 'used'
    mileage: string
    price: string
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    transmission: 'manual' | 'automatic'
    engine: string
    location: {
      region: string
      town: string
      otherTown?: string
    }
    description: string
    gearCount: string
    VIN: string
    colour: string
    frameMaterial: string
    brakeType: string
    bikeType: string
    bodyType: string
    features: []
}

export const fetchListings = async () => {

  try {
    const querySnapshot = await getDocs(collection(db, "listings"));
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as VehicleData[]; // Type assertion to VehicleData[] for simplicity

    console.log("Fetched listings:", listings);
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}


