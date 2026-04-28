// import { Timestamp } from "firebase/firestore";

// export const formatMemberSince = (timestamp: Timestamp | Date | number): string => {
//   let date: Date;
//   if (timestamp instanceof Timestamp) {
//     date = timestamp.toDate();
//   } else if (timestamp instanceof Date) {
//     date = timestamp;
//   } else {
//     date = new Date(timestamp);
//   }

//   const day   = date.getDate();
//   const month = date.toLocaleString("en-US", { month: "long" });
//   const year  = date.getFullYear();

//   return `Member since ${month} ${day}, ${year}`;
// };

import { Timestamp } from "firebase/firestore";

export const formatMemberSince = (timestamp: Timestamp | Date | number | null | undefined): string => {
  // Return a fallback if timestamp hasn't resolved yet
  if (!timestamp || !(timestamp instanceof Timestamp)) return "Recently joined";

  const date  = timestamp.toDate();
  const day   = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year  = date.getFullYear();

  return `Member since ${month} ${day}, ${year}`;
};