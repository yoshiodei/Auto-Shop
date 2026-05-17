// import { Timestamp } from 'firebase/firestore';
// import type { Message } from '@/hooks/useChat';

// export type MessageGroup = {
//   label:    string; // 'Today', 'Yesterday', or 'March 4, 2026'
//   messages: Message[];
// };

// const getDayLabel = (date: Date): string => {
//   const today     = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);

//   const isSameDay = (a: Date, b: Date) =>
//     a.getDate()     === b.getDate()     &&
//     a.getMonth()    === b.getMonth()    &&
//     a.getFullYear() === b.getFullYear();

//   if (isSameDay(date, today))     return 'Today';
//   if (isSameDay(date, yesterday)) return 'Yesterday';

//   return date.toLocaleString('en-US', {
//     month: 'long', day: 'numeric', year: 'numeric',
//   });
// };

// export const groupMessagesByDay = (messages: Message[]): MessageGroup[] => {
//   const groups: Record<string, Message[]> = {};

//   messages.forEach((msg) => {
//     const date  = msg.createdAt instanceof Timestamp
//       ? msg.createdAt.toDate()
//       : new Date(msg.createdAt);
//     const label = getDayLabel(date);

//     if (!groups[label]) groups[label] = [];
//     groups[label].push(msg);
//   });

//   return Object.entries(groups).map(([label, messages]) => ({
//     label,
//     messages,
//   }));
// };

import { Timestamp } from 'firebase/firestore';
import type { Message } from '@/lib/types';

export type MessageGroup = {
  label:    string;
  messages: Message[];
};

const getDayLabel = (date: Date): string => {
  const today     = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate()     === b.getDate()     &&
    a.getMonth()    === b.getMonth()    &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(date, today))     return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

const resolveDate = (createdAt: any): Date | null => {
  if (!createdAt)                        return null; // still pending
  if (createdAt instanceof Timestamp)    return createdAt.toDate();
  if (createdAt instanceof Date)         return createdAt;
  if (typeof createdAt === 'number')     return new Date(createdAt);
  // Firestore pending write — has seconds but not yet a Timestamp instance
  if (createdAt?.seconds)               return new Date(createdAt.seconds * 1000);
  return null;
};

export const groupMessagesByDay = (messages: Message[]): MessageGroup[] => {
  const groups: Record<string, Message[]> = {};

  messages.forEach((msg) => {
    const date = resolveDate(msg.createdAt);

    // If timestamp hasn't resolved yet, bin it under today so
    // it doesn't create a ghost group
    const label = date ? getDayLabel(date) : getDayLabel(new Date());

    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
  });

  return Object.entries(groups).map(([label, messages]) => ({
    label,
    messages,
  }));
};