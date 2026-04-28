import { showToast } from "@/context/ShowToast";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { sendVehicleNotification } from "./notifications/sendNotification";

type ImageItem = {
  file: File;
  preview: string;
};

export const createVehicle = async (
  formData: any,
  images: ImageItem[],
  coverIndex: number
) => {
  try {
    // ✅ 1. Create Firestore doc first (to get ID)
    const docRef = doc(collection(db, "listings"));
    const vehicleId = docRef.id;

    const imageUrls: string[] = [];
    const imagePaths: string[] = [];

    // ✅ 2. Upload Images
    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      const filePath = `vehicles/${vehicleId}/${Date.now()}-${i}-${img.file.name}`;
      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, img.file);
      const downloadURL = await getDownloadURL(storageRef);

      imageUrls.push(downloadURL);
      imagePaths.push(filePath);
    }

    // ✅ 3. Determine cover image
    const coverImage = imageUrls[coverIndex ?? 0];

    // ✅ 4. Build final object
    const vehicleData = {
      title: formData.title || `${formData.brand} ${formData.model} ${formData.year}`,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      condition: formData.condition,
      mileage: formData.mileage,
      price: formData.price,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      engine: formData.engine,

      location: {
        region: formData.location.region,
        town: formData.location.town,
        otherTown: formData.location.otherTown,
      },

      description: formData.description,

      gearCount: formData.gearCount,
      VIN: formData.VIN,
      colour: formData.colour,
      frameMaterial: formData.frameMaterial,
      brakeType: formData.brakeType,
      bikeType: formData.bikeType,
      bodyType: formData.bodyType,

      features: formData.features || [],

      imageUrls,
      imagePaths,
      coverImage,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // ✅ 5. Save to Firestore
    await setDoc(docRef, vehicleData);
    showToast("Vehicle posted successfully!", "success");

    await sendVehicleNotification({
      vehicleId,
      vehicleTitle: formData.title || `${formData.brand} ${formData.model} ${formData.year}`,
      postedBy: 'admin',
      imageUrl: coverImage,
    })

    return { success: true, vehicleId };
  } catch (error) {
    console.error("Error creating vehicle:", error);
    showToast("Error posting vehicle.", "error");
    return { success: false, error };
  }
};