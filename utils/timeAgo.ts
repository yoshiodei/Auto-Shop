import { Timestamp } from "firebase/firestore";

export const timeAgo = (timestamp: Timestamp | Date | number): string => {
  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals = [
    { label: "yr",  seconds: 31_536_000 },
    { label: "mo",  seconds:  2_592_000 },
    { label: "wk",  seconds:    604_800 },
    { label: "day", seconds:     86_400 },
    { label: "hr",  seconds:      3_600 },
    { label: "min", seconds:         60 },
  ];

  for (const { label, seconds: intervalSecs } of intervals) {
    const count = Math.floor(seconds / intervalSecs);
    if (count >= 1) {
      return `${count} ${label}${count > 1 && label !== "mo" ? "s" : ""} ago`;
    }
  }

  return "just now";
}