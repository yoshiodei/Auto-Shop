import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type SendNotificationPayload = {
  vehicleId:    string;
  vehicleTitle: string;
  postedBy:     string; // userId of the poster
  imageUrl?:    string; // first image of the vehicle
};

// Fetch all user IDs from Firestore
const getAllUserIds = async (): Promise<string[]> => {
  const usersSnap = await getDocs(collection(db, 'users'));
  return usersSnap.docs.map((doc) => doc.id);
};

// Create a notification doc for every user except the poster
export const sendVehicleNotification = async ({
  vehicleId,
  vehicleTitle,
  postedBy,
  imageUrl,
}: SendNotificationPayload): Promise<void> => {
  const allUserIds = await getAllUserIds();

  // Exclude the user who posted the vehicle
  const recipients = allUserIds.filter((uid) => uid !== postedBy);

  const notificationPromises = recipients.map((uid) =>
    addDoc(collection(db, 'users', uid, 'notifications'), {
      type:         'new_vehicle',
      title:        'New vehicle listed',
      message:      `${vehicleTitle} was just listed. Check it out!`,
      vehicleId,
      imageUrl:     imageUrl ?? null,
      isRead:       false,
      createdAt:    serverTimestamp(),
    })
  );

  await Promise.all(notificationPromises);
};