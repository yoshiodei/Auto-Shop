// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { collection, query, orderBy,
//   onSnapshot, doc, onSnapshot as docSnapshot } from 'firebase/firestore';
// import { db }                                   from '@/lib/firebase';
// // import { useAuthStore }                         from '@/store/authStore';
// // import { getOrCreateChatRoom }                  from '@/lib/chat/getOrCreateChatRoom';
// // import { sendMessage }                          from '@/lib/chat/sendMessage';
// import { useChat }                              from '@/hooks/useChat';
// // import { groupMessagesByDay }                   from '@/utils/chat/groupMessagesByDay';
// import { Timestamp }                            from 'firebase/firestore';
// import { Send, Search, MessageSquare }          from 'lucide-react';
// // import { formatDate }                           from '@/lib/utils/formatDate';
// // import UserAvatar                               from '@/components/UserAvatar';

// const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID!;

// type ChatRoom = {
//   id:            string;
//   userId:        string;
//   lastMessage:   string | null;
//   lastMessageAt: any;
//   // user profile joined in
//   fullName:      string;
//   photoURL:      string | null;
//   isOnline:      boolean;
//   lastSeen:      any;
// };

// type SelectedUser = {
//   uid:      string;
//   fullName: string;
//   photoURL: string | null;
//   isOnline: boolean;
//   lastSeen: any;
// };

// // ── Message bubble ────────────────────────────────────────────
// const MessageBubble = ({
//   message,
//   isMine,
// }: {
//   message: { text: string; createdAt: any };
//   isMine:  boolean;
// }) => {
//   const time = message.createdAt instanceof Timestamp
//     ? message.createdAt.toDate().toLocaleTimeString('en-US', {
//         hour: '2-digit', minute: '2-digit',
//       })
//     : '';

//   return (
//     <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
//       <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
//         isMine
//           ? 'bg-[#FF6B7A] text-white rounded-br-sm'
//           : 'bg-gray-100 text-gray-900 rounded-bl-sm'
//       }`}>
//         <p className="text-sm leading-relaxed break-words">{message.text}</p>
//         <p className={`text-[10px] mt-1 text-right ${
//           isMine ? 'text-white/70' : 'text-gray-400'
//         }`}>
//           {time}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ── Day divider ───────────────────────────────────────────────
// const DayDivider = ({ label }: { label: string }) => (
//   <div className="flex items-center gap-3 my-4">
//     <div className="flex-1 h-px bg-gray-200" />
//     <span className="text-xs text-gray-400 font-medium px-2">{label}</span>
//     <div className="flex-1 h-px bg-gray-200" />
//   </div>
// );

// // ── Online indicator ──────────────────────────────────────────
// const OnlineIndicator = ({
//   isOnline, lastSeen,
// }: {
//   isOnline: boolean; lastSeen: any;
// }) => {
//   if (isOnline) {
//     return (
//       <div className="flex items-center gap-1.5">
//         <span className="w-2 h-2 rounded-full bg-green-500" />
//         <span className="text-xs text-green-600 font-medium">Online</span>
//       </div>
//     );
//   }

//   return (
//     <span className="text-xs text-gray-400">
//       Last seen {lastSeen ? formatDate(lastSeen) : 'a while ago'}
//     </span>
//   );
// };

// // ── Main page ─────────────────────────────────────────────────
// const ChatPage = () => {
//   const user    = useAuthStore((state) => state.user);
//   const isAdmin = user?.uid === ADMIN_ID;

//   const [roomId,        setRoomId]        = useState<string | null>(null);
//   const [selectedUser,  setSelectedUser]  = useState<SelectedUser | null>(null);
//   const [chatRooms,     setChatRooms]     = useState<ChatRoom[]>([]);
//   const [searchQuery,   setSearchQuery]   = useState('');
//   const [messageText,   setMessageText]   = useState('');
//   const [sending,       setSending]       = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef       = useRef<HTMLInputElement>(null);

//   const { messages, isLoading } = useChat(roomId, user?.uid ?? '');
//   const messageGroups           = groupMessagesByDay(messages);

//   // ── Scroll to bottom ────────────────────────────────────────
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // ── Admin: load all chat rooms ───────────────────────────────
//   useEffect(() => {
//     if (!isAdmin) return;

//     const q = query(
//       collection(db, 'chatRooms'),
//       orderBy('lastMessageAt', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, async (snap) => {
//       const rooms = await Promise.all(
//         snap.docs.map(async (roomDoc) => {
//           const data       = roomDoc.data();
//           const userDocRef = doc(db, 'users', data.userId);

//           return new Promise<ChatRoom>((resolve) => {
//             docSnapshot(userDocRef, (userSnap) => {
//               const userData = userSnap.data();
//               resolve({
//                 id:            roomDoc.id,
//                 userId:        data.userId,
//                 lastMessage:   data.lastMessage,
//                 lastMessageAt: data.lastMessageAt,
//                 fullName:      userData?.fullName  ?? 'Unknown User',
//                 photoURL:      userData?.photoURL  ?? null,
//                 isOnline:      userData?.isOnline  ?? false,
//                 lastSeen:      userData?.lastSeen  ?? null,
//               });
//             });
//           });
//         })
//       );
//       setChatRooms(rooms);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   // ── User: auto-load their room with admin ────────────────────
//   useEffect(() => {
//     if (!user || isAdmin) return;

//     const initRoom = async () => {
//       const id = await getOrCreateChatRoom(user.uid);
//       setRoomId(id);

//       // Listen to admin profile for online status
//       const unsubscribe = docSnapshot(doc(db, 'users', ADMIN_ID), (snap) => {
//         const data = snap.data();
//         setSelectedUser({
//           uid:      ADMIN_ID,
//           fullName: data?.fullName  ?? 'Admin',
//           photoURL: data?.photoURL  ?? null,
//           isOnline: data?.isOnline  ?? false,
//           lastSeen: data?.lastSeen  ?? null,
//         });
//       });

//       return () => unsubscribe();
//     };

//     initRoom();
//   }, [user, isAdmin]);

//   // ── Admin: select a user room ────────────────────────────────
//   const handleSelectRoom = (room: ChatRoom) => {
//     setRoomId(room.id);
//     setSelectedUser({
//       uid:      room.userId,
//       fullName: room.fullName,
//       photoURL: room.photoURL,
//       isOnline: room.isOnline,
//       lastSeen: room.lastSeen,
//     });
//     inputRef.current?.focus();
//   };

//   // ── Send message ─────────────────────────────────────────────
//   const handleSend = async () => {
//     if (!roomId || !user || !messageText.trim()) return;

//     setSending(true);
//     try {
//       await sendMessage({ roomId, senderId: user.uid, text: messageText });
//       setMessageText('');
//       scrollToBottom();
//     } finally {
//       setSending(false);
//       inputRef.current?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // ── Filter rooms by search ───────────────────────────────────
//   const filteredRooms = chatRooms.filter((room) =>
//     room.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-500 text-sm">Please sign in to use chat.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-[calc(100vh-64px)] bg-white border border-gray-200 rounded-xl overflow-hidden">

//       {/* ── Left panel ─────────────────────────────────────── */}
//       <div className={`flex flex-col border-r border-gray-100 ${
//         isAdmin ? 'w-80' : 'w-72'
//       }`}>

//         <div className="p-4 border-b border-gray-100">
//           <h2 className="text-base font-medium text-gray-900 mb-3">
//             {isAdmin ? 'All chats' : 'Messages'}
//           </h2>

//           {/* Search — admin only */}
//           {isAdmin && (
//             <div className="relative">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//               />
//             </div>
//           )}
//         </div>

//         {/* Room list */}
//         <div className="flex-1 overflow-y-auto">

//           {/* Admin view — all users */}
//           {isAdmin && (
//             filteredRooms.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center px-4">
//                 <MessageSquare size={28} className="text-gray-300 mb-2" />
//                 <p className="text-sm text-gray-400">No chats found</p>
//               </div>
//             ) : (
//               filteredRooms.map((room) => (
//                 <button
//                   key={room.id}
//                   onClick={() => handleSelectRoom(room)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
//                     roomId === room.id ? 'bg-red-50 border-r-2 border-[#FF6B7A]' : ''
//                   }`}
//                 >
//                   <div className="relative shrink-0">
//                     {room.photoURL ? (
//                       <img
//                         src={room.photoURL}
//                         alt={room.fullName}
//                         className="w-10 h-10 rounded-full object-cover"
//                       />
//                     ) : (
//                       <UserAvatar fullName={room.fullName} size="sm" />
//                     )}
//                     {room.isOnline && (
//                       <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {room.fullName}
//                     </p>
//                     {room.lastMessage && (
//                       <p className="text-xs text-gray-400 truncate mt-0.5">
//                         {room.lastMessage}
//                       </p>
//                     )}
//                   </div>
//                   {room.lastMessageAt && (
//                     <span className="text-[10px] text-gray-400 shrink-0">
//                       {formatDate(room.lastMessageAt)}
//                     </span>
//                   )}
//                 </button>
//               ))
//             )
//           )}

//           {/* User view — only admin */}
//           {!isAdmin && selectedUser && (
//             <button
//               className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 border-r-2 border-[#FF6B7A] text-left"
//             >
//               <div className="relative shrink-0">
//                 {selectedUser.photoURL ? (
//                   <img
//                     src={selectedUser.photoURL}
//                     alt={selectedUser.fullName}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                 ) : (
//                   <UserAvatar fullName={selectedUser.fullName} size="sm" />
//                 )}
//                 {selectedUser.isOnline && (
//                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {selectedUser.fullName}
//                 </p>
//                 <p className="text-xs text-gray-400">Support</p>
//               </div>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Right panel ────────────────────────────────────── */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {!selectedUser ? (
//           // No chat selected yet
//           <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
//             <MessageSquare size={40} className="text-gray-300 mb-3" />
//             <p className="text-gray-900 font-medium">No conversation selected</p>
//             <p className="text-gray-400 text-sm mt-1.5">
//               {isAdmin
//                 ? 'Select a user from the left to view their messages.'
//                 : 'Start a conversation with our support team.'}
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Chat header */}
//             <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
//               <div className="relative">
//                 {selectedUser.photoURL ? (
//                   <img
//                     src={selectedUser.photoURL}
//                     alt={selectedUser.fullName}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                 ) : (
//                   <UserAvatar fullName={selectedUser.fullName} size="sm" />
//                 )}
//                 {selectedUser.isOnline && (
//                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
//                 )}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {selectedUser.fullName}
//                 </p>
//                 <OnlineIndicator
//                   isOnline={selectedUser.isOnline}
//                   lastSeen={selectedUser.lastSeen}
//                 />
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
//               {isLoading ? (
//                 <div className="flex items-center justify-center h-full">
//                   <p className="text-sm text-gray-400">Loading messages...</p>
//                 </div>
//               ) : messages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center">
//                   <MessageSquare size={32} className="text-gray-300 mb-2" />
//                   <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
//                 </div>
//               ) : (
//                 messageGroups.map((group) => (
//                   <div key={group.label}>
//                     <DayDivider label={group.label} />
//                     <div className="flex flex-col gap-2">
//                       {group.messages.map((message) => (
//                         <MessageBubble
//                           key={message.id}
//                           message={message}
//                           isMine={message.senderId === user.uid}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               )}
//               {/* Invisible anchor to scroll to */}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div className="px-6 py-4 border-t border-gray-100">
//               <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={messageText}
//                   onChange={(e) => setMessageText(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Type a message..."
//                   className="flex-1 text-sm bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
//                 />
//                 <button
//                   onClick={handleSend}
//                   disabled={!messageText.trim() || sending}
//                   aria-label="Send message"
//                   className="p-2 rounded-lg bg-[#FF6B7A] hover:bg-[#FF5566] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
//                 >
//                   <Send size={16} />
//                 </button>
//               </div>
//               <p className="text-[11px] text-gray-400 mt-2 text-center">
//                 Press Enter to send
//               </p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;