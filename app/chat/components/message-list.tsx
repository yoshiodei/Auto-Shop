'use client'

import { MessageCircle }         from 'lucide-react'
import { Timestamp }             from 'firebase/firestore'
import { groupMessagesByDay }    from '@/utils/chats/groupMessagesByDay'
import type { Message }          from '@/lib/types'

interface Props {
  messages:      Message[]
  isLoading:     boolean
  currentUserId: string
  bottomRef:     React.RefObject<HTMLDivElement>
}

const resolveTime = (createdAt: any): string => {
  if (!createdAt) return ''; // pending — show nothing

  let date: Date | null = null;

  if (createdAt instanceof Timestamp) date = createdAt.toDate();
  else if (createdAt instanceof Date) date = createdAt;
  else if (createdAt?.seconds)        date = new Date(createdAt.seconds * 1000);

  return date
    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';
};

export function MessageList({ messages, isLoading, currentUserId, bottomRef }: Props) {
  const messageGroups = groupMessagesByDay(messages)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading messages...</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">No messages yet. Say hello!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messageGroups.map((group) => (
        <div key={group.label}>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium px-2">{group.label}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-4">
            {group.messages.map((message) => {
              const isMine = message.senderId === currentUserId

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    isMine
                      ? 'bg-[#FF6B7A] text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    {/* Only render time once timestamp resolves */}
                    {resolveTime(message.createdAt) && (
                      <p className={`text-xs mt-1 ${
                        isMine ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {resolveTime(message.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}




// 'use client'

// import { useEffect }             from 'react'
// import { MessageCircle }         from 'lucide-react'
// import { Timestamp }             from 'firebase/firestore'
// import { groupMessagesByDay }    from '@/utils/chats/groupMessagesByDay'
// import type { Message }          from '@/lib/types'

// interface Props {
//   messages:      Message[]
//   isLoading:     boolean
//   currentUserId: string
//   bottomRef:     React.RefObject<HTMLDivElement>
// }

// export function MessageList({ messages, isLoading, currentUserId, bottomRef }: Props) {
//   const messageGroups = groupMessagesByDay(messages)

//   if (isLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <p className="text-sm text-gray-400">Loading messages...</p>
//       </div>
//     )
//   }

//   if (messages.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
//         <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//         <p className="text-gray-600">No messages yet. Say hello!</p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//       {messageGroups.map((group) => (
//         <div key={group.label}>

//           {/* Day divider */}
//           <div className="flex items-center gap-3 my-4">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400 font-medium px-2">{group.label}</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           <div className="space-y-4">
//             {group.messages.map((message) => {
//               const isMine = message.senderId === currentUserId
//               const time   = message.createdAt instanceof Timestamp
//                 ? message.createdAt.toDate().toLocaleTimeString('en-US', {
//                     hour: '2-digit', minute: '2-digit',
//                   })
//                 : ''

//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div className={`max-w-xs px-4 py-2 rounded-lg ${
//                     isMine
//                       ? 'bg-[#FF6B7A] text-white rounded-br-none'
//                       : 'bg-gray-100 text-gray-900 rounded-bl-none'
//                   }`}>
//                     <p className="text-sm">{message.text}</p>
//                     <p className={`text-xs mt-1 ${
//                       isMine ? 'text-white/70' : 'text-gray-500'
//                     }`}>
//                       {time}
//                     </p>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       ))}
//       <div ref={bottomRef} />
//     </div>
//   )
// }