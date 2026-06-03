import {
  collection, addDoc,
  getDocs, serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

type SendVehicleNotificationPayload = {
  vehicleId:    string
  vehicleTitle: string
  postedBy:     string
  imageUrl?:    string | null
}

type SendNotificationResult = {
  success: boolean
  error?:  string
}

// Fetch all user IDs from Firestore
const getAllUserIds = async (): Promise<string[]> => {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((doc) => doc.id)
}

// Send a single notification doc to one user
const sendNotificationToUser = async (
  userId:  string,
  payload: SendVehicleNotificationPayload
): Promise<void> => {
  await addDoc(collection(db, 'users', userId, 'notifications'), {
    type:      'new_vehicle',
    title:     'New vehicle listed',
    message:   `${payload.vehicleTitle} was just listed. Check it out!`,
    vehicleId: payload.vehicleId,
    imageUrl:  payload.imageUrl ?? null,
    isRead:    false,
    createdAt: serverTimestamp(),
  })
}

export const sendVehicleNotification = async (
  payload: SendVehicleNotificationPayload
): Promise<SendNotificationResult> => {
  try {
    const allUserIds = await getAllUserIds()

    // Exclude the user who posted the vehicle
    const recipients = allUserIds.filter((uid) => uid !== payload.postedBy)

    // Send to all recipients concurrently
    await Promise.all(
      recipients.map((uid) => sendNotificationToUser(uid, payload))
    )

    return { success: true }
  } catch (error: any) {
    console.error('Failed to send vehicle notification:', error.message)
    return { success: false, error: error.message }
  }
}






// import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// type SendNotificationPayload = {
//   vehicleId:    string;
//   vehicleTitle: string;
//   postedBy:     string; // userId of the poster
//   imageUrl?:    string; // first image of the vehicle
// };

// // Fetch all user IDs from Firestore
// const getAllUserIds = async (): Promise<string[]> => {
//   const usersSnap = await getDocs(collection(db, 'users'));
//   return usersSnap.docs.map((doc) => doc.id);
// };

// // Create a notification doc for every user except the poster
// export const sendVehicleNotification = async ({
//   vehicleId,
//   vehicleTitle,
//   postedBy,
//   imageUrl,
// }: SendNotificationPayload): Promise<void> => {
//   const allUserIds = await getAllUserIds();

//   // Exclude the user who posted the vehicle
//   const recipients = allUserIds.filter((uid) => uid !== postedBy);

//   const notificationPromises = recipients.map((uid) =>
//     addDoc(collection(db, 'users', uid, 'notifications'), {
//       type:         'new_vehicle',
//       title:        'New vehicle listed',
//       message:      `${vehicleTitle} was just listed. Check it out!`,
//       vehicleId,
//       imageUrl:     imageUrl ?? null,
//       isRead:       false,
//       createdAt:    serverTimestamp(),
//     })
//   );

//   await Promise.all(notificationPromises);
// };